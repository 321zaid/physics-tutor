alter table public.classes
  add column if not exists curriculum text,
  add column if not exists start_time timestamptz,
  add column if not exists end_time timestamptz;

create index if not exists idx_classes_start_time
  on public.classes(start_time);
