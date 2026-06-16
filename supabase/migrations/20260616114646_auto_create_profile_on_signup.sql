create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone, grade_board, role, access, fee_paid)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'Student'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'grade_board',
    case when new.email = 'zaid123was@gmail.com' then 'super_admin'::text else 'student'::text end,
    case when new.email = 'zaid123was@gmail.com' then true else false end,
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
