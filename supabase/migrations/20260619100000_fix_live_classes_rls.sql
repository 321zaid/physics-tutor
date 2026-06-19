-- Fix RLS on live_classes so students can see classes where subject/curriculum is null
-- Old policy required strict equality: profiles.subject = live_classes.subject
-- New policy allows match when live_classes.subject IS NULL too

drop policy if exists "Students can read matching live classes" on public.live_classes;

create policy "Students can read matching live classes"
  on public.live_classes
  for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.access = true
        and profiles.role = 'student'
        and (profiles.subject = live_classes.subject or live_classes.subject is null)
        and (profiles.curriculum = live_classes.curriculum or live_classes.curriculum is null)
        and live_classes.is_live = true
        and live_classes.join_link is not null
    )
  );
