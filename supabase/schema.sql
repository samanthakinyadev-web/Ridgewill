-- Ridgewill Global Logistics — Shipment Tracking schema
-- Run in the Supabase SQL editor. Safe to re-run.

-- ============================================================
-- Tables
-- ============================================================

create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_no text unique not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  reference text,
  service text not null,
  cargo_type text,
  origin text not null,
  destination text not null,
  eta date,
  current_status text not null default 'booked',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shipment_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references shipments(id) on delete cascade,
  status text not null,
  location text,
  note text,
  is_public boolean not null default true,
  occurred_at timestamptz not null default now(),
  -- Insertion time, kept separate from occurred_at: occurred_at is editable by
  -- staff, created_at is not. It also gives the status trigger a stable
  -- tie-break when two events share an occurred_at.
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists staff (
  user_id uuid primary key references auth.users(id)
);

-- ============================================================
-- Indexes (admin list: sort by last updated, filter by status)
-- ============================================================

create index if not exists shipments_updated_at_idx on shipments (updated_at desc);
create index if not exists shipments_current_status_idx on shipments (current_status);
create index if not exists shipments_service_idx on shipments (service);
create index if not exists shipment_events_shipment_idx
  on shipment_events (shipment_id, occurred_at desc, created_at desc);
create index if not exists shipment_events_public_idx
  on shipment_events (shipment_id) where is_public;

-- ============================================================
-- Triggers
-- ============================================================

-- Keep shipments.updated_at fresh on every write.
create or replace function set_shipments_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists shipments_set_updated_at on shipments;
create trigger shipments_set_updated_at
  before update on shipments
  for each row execute function set_shipments_updated_at();

-- Derive shipments.current_status from the newest PUBLIC event, and bump
-- updated_at, whenever an event is inserted, edited or removed.
-- Internal (is_public = false) events are ignored by design: a private note
-- must never move the customer's progress bar.
create or replace function sync_shipment_from_events() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  target uuid;
  latest text;
begin
  target := case when tg_op = 'DELETE' then old.shipment_id else new.shipment_id end;

  select e.status into latest
  from shipment_events e
  where e.shipment_id = target and e.is_public
  order by e.occurred_at desc, e.created_at desc
  limit 1;

  -- With no public events left we leave current_status as-is rather than
  -- resetting a shipment that staff may still be working on.
  if latest is not null then
    update shipments
       set current_status = latest, updated_at = now()
     where id = target;
  else
    update shipments set updated_at = now() where id = target;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end $$;

drop trigger if exists shipment_events_sync_status on shipment_events;
create trigger shipment_events_sync_status
  after insert or update or delete on shipment_events
  for each row execute function sync_shipment_from_events();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table shipments enable row level security;
alter table shipment_events enable row level security;
alter table staff enable row level security;

-- No anon/authenticated read policy exists on any table, so direct
-- table access is denied. The public site can only reach data through
-- track_shipment() below.

create policy staff_all_shipments on shipments for all
  using (exists (select 1 from staff s where s.user_id = auth.uid()))
  with check (exists (select 1 from staff s where s.user_id = auth.uid()));

create policy staff_all_events on shipment_events for all
  using (exists (select 1 from staff s where s.user_id = auth.uid()))
  with check (exists (select 1 from staff s where s.user_id = auth.uid()));

create policy staff_read_staff on staff for select
  using (user_id = auth.uid());

-- ============================================================
-- Public lookup
-- ============================================================
-- security definer so it can read through RLS, but it only ever projects
-- the columns listed below. customer_name, customer_email, customer_phone,
-- reference, internal notes and is_public are NOT in the output, so they
-- cannot leak through this path.

create or replace function track_shipment(p_tracking_no text)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'tracking_no', s.tracking_no,
    'service', s.service,
    'cargo_type', s.cargo_type,
    'origin', s.origin,
    'destination', s.destination,
    'eta', s.eta,
    'current_status', s.current_status,
    'updated_at', s.updated_at,
    'events', (
      select coalesce(
        json_agg(
          json_build_object(
            'status', e.status,
            'location', e.location,
            'note', e.note,
            'occurred_at', e.occurred_at
          ) order by e.occurred_at desc
        ),
        '[]'::json
      )
      from shipment_events e
      where e.shipment_id = s.id and e.is_public
    )
  )
  from shipments s
  where s.tracking_no = upper(trim(p_tracking_no));
$$;

revoke all on function track_shipment(text) from public;
grant execute on function track_shipment(text) to anon, authenticated;

-- ============================================================
-- First staff user (run manually)
-- ============================================================
-- 1. Create the user in Supabase → Authentication → Users.
-- 2. Copy its UUID, then:
--
-- insert into staff (user_id) values ('<paste-user-uuid-here>');
--
-- This table has no insert policy for authenticated users on purpose:
-- only you, in the SQL editor, can grant staff access.
