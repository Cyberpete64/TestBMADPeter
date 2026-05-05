create extension if not exists pgcrypto;

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  player_name text not null,
  played_on date not null,
  course_slug text not null,
  course_label text not null,
  course_short_label text not null,
  tee_code text not null check (tee_code in ('red', 'yellow')),
  tee_label text not null,
  entered_handicap numeric(5, 1) not null,
  total_score integer not null,
  total_putts integer not null,
  total_stableford_points integer not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.round_holes (
  round_id uuid not null references public.rounds (id) on delete cascade,
  hole_number smallint not null check (hole_number between 1 and 18),
  par smallint not null,
  stroke_index smallint not null,
  strokes smallint not null,
  putts smallint not null,
  received_strokes smallint not null,
  stableford_points smallint not null,
  primary key (round_id, hole_number)
);

create index if not exists rounds_user_id_played_on_idx
  on public.rounds (user_id, played_on desc, created_at desc);

alter table public.rounds enable row level security;
alter table public.round_holes enable row level security;

create policy "Users can view their own rounds"
  on public.rounds
  for select
  to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can insert their own rounds"
  on public.rounds
  for insert
  to authenticated
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can update their own rounds"
  on public.rounds
  for update
  to authenticated
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can delete their own rounds"
  on public.rounds
  for delete
  to authenticated
  using (auth.uid() is not null and auth.uid() = user_id);

create policy "Users can view holes for their own rounds"
  on public.round_holes
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.rounds
      where rounds.id = round_holes.round_id
        and rounds.user_id = auth.uid()
    )
  );

create policy "Users can insert holes for their own rounds"
  on public.round_holes
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.rounds
      where rounds.id = round_holes.round_id
        and rounds.user_id = auth.uid()
    )
  );

create policy "Users can update holes for their own rounds"
  on public.round_holes
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.rounds
      where rounds.id = round_holes.round_id
        and rounds.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.rounds
      where rounds.id = round_holes.round_id
        and rounds.user_id = auth.uid()
    )
  );

create policy "Users can delete holes for their own rounds"
  on public.round_holes
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.rounds
      where rounds.id = round_holes.round_id
        and rounds.user_id = auth.uid()
    )
  );
