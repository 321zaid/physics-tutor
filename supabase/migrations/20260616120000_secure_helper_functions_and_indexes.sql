-- Secure helper functions and add FK indexes
-- 1. Move RLS helper functions to `private` schema (inaccessible via /rpc)
-- 2. Update profiles RLS policies to use private. functions
-- 3. Revoke EXECUTE on trigger-only functions from anon/authenticated
-- 4. Add FK indexes on classes, live_classes, payments

-- ============================================================
-- PART 1: Create private schema and move helper functions
-- ============================================================
create schema if not exists private;

create or replace function private.my_role()
returns text
language sql
stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function private.my_access()
returns boolean
language sql
stable security definer
set search_path = public
as $$
  select access from public.profiles where id = auth.uid()
$$;

create or replace function private.profile_role(uid uuid)
returns text
language sql
stable security definer
set search_path = public
as $$
  select role from public.profiles where id = uid
$$;

create or replace function private.zaid_id()
returns uuid
language sql
stable security definer
set search_path = public
as $$
  select id from public.profiles where email = 'zaid123was@gmail.com'
$$;

-- Grant EXECUTE for RLS evaluation (supported roles that query profiles)
grant execute on function private.my_role() to anon, authenticated;
grant execute on function private.my_access() to anon, authenticated;
grant execute on function private.profile_role(uuid) to anon, authenticated;
grant execute on function private.zaid_id() to anon, authenticated;

-- ============================================================
-- PART 2: Update profiles RLS policies to use private.* helpers
-- ============================================================
-- Drop old policies, recreate with fully qualified function names

drop policy if exists "View profiles" on public.profiles;
create policy "View profiles" on public.profiles
  for select
  to public
  using (
    (auth.uid() = id)
    or
    (private.my_role() = any (array['admin'::text, 'super_admin'::text]))
  );

drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile" on public.profiles
  for insert
  to public
  with check (auth.uid() = id);

drop policy if exists "Self update basic info" on public.profiles;
create policy "Self update basic info" on public.profiles
  for update
  to public
  using (auth.uid() = id)
  with check (
    (auth.uid() = id)
    and
    (private.my_role() = role)
    and
    (not (access is distinct from private.my_access()))
  );

drop policy if exists "Admin update profiles" on public.profiles;
create policy "Admin update profiles" on public.profiles
  for update
  to public
  using (private.my_role() = any (array['admin'::text, 'super_admin'::text]))
  with check (
    (private.my_role() = 'super_admin'::text)
    or
    (private.profile_role(id) = 'student'::text and role = 'student'::text)
    or
    (auth.uid() = id and role = 'admin'::text)
  );

drop policy if exists "Only permanent super admin can manage roles" on public.profiles;
create policy "Only permanent super admin can manage roles" on public.profiles
  for update
  to public
  using (auth.uid() = private.zaid_id())
  with check (auth.uid() = private.zaid_id());

-- ============================================================
-- PART 3: Revoke EXECUTE on trigger-only functions
-- ============================================================
revoke execute on function public.protect_super_admin() from anon, authenticated, public;
revoke execute on function public.check_role_change_permission() from anon, authenticated, public;
revoke execute on function public.prevent_super_admin_delete() from anon, authenticated, public;
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- ============================================================
-- PART 4: Drop public helper functions (moved to private)
-- ============================================================
drop function if exists public.my_role();
drop function if exists public.my_access();
drop function if exists public.profile_role(uuid);
drop function if exists public.zaid_id();

-- ============================================================
-- PART 5: Add FK indexes (P3)
-- ============================================================
create index if not exists idx_classes_created_by
  on public.classes(created_by);

create index if not exists idx_live_classes_created_by
  on public.live_classes(created_by);

create index if not exists idx_payments_student_id
  on public.payments(student_id);
