-- THE REVIEW BOARD'S DATABASE — edit requests, statuses and comments for /sitemap/.
--
-- Apply with the Supabase SQL editor, or the Management API. It is idempotent: every object is
-- created IF NOT EXISTS or replaced, so re-running it is safe.
--
-- ── IT LIVES IN ITS OWN SCHEMA, NOT public ───────────────────────────────────────────────────
--
-- Whichever project this lands in, `review` keeps it separate from whatever else is there. The
-- candidate project already holds a field-sales app — agencies, prospects, referrals, field_users —
-- and a review board for a marketing website has no business sharing a namespace with it. A schema
-- is real isolation: separate grants, separate RLS, and `drop schema review cascade` removes every
-- trace of this without touching anything else.
--
-- ── WHY RLS IS NOT OPTIONAL HERE ─────────────────────────────────────────────────────────────
--
-- The board is static HTML on a public URL, built from a PUBLIC GitHub repo. The anon key ships in
-- that HTML — that is normal for Supabase and safe ONLY because row-level security decides what the
-- key can actually do. With RLS off, publishing the board would publish an editable database.
--
-- So: every table denies by default, and every policy below requires `auth.role() = 'authenticated'`.
-- Anonymous visitors can read nothing and write nothing. The team signs in; nobody else has a door.

create schema if not exists review;

-- ── PAGES ────────────────────────────────────────────────────────────────────────────────────
-- Mirrors what the build knows: one row per page, refreshed from the site build rather than typed.
-- `path` is the key because it is what the build, the redirect map and a browser all agree on.
create table if not exists review.pages (
  path          text primary key,
  title         text not null,
  lane          text not null,
  market        text,
  indexable     boolean not null default true,
  waiting_on    text,
  absorbed_urls integer not null default 0,
  synced_at     timestamptz not null default now()
);

-- ── PAGE STATUS ──────────────────────────────────────────────────────────────────────────────
-- The tick and the status that used to live in one person's localStorage. One row per page, so
-- the team sees the same board rather than three private copies of it.
create table if not exists review.page_status (
  path        text primary key references review.pages(path) on delete cascade,
  reviewed    boolean not null default false,
  status      text not null default '' check (status in ('','reviewing','copy','design','blocked','done')),
  notes       text not null default '',
  updated_by  uuid references auth.users(id),
  updated_at  timestamptz not null default now()
);

-- ── SECTION CHECKS ───────────────────────────────────────────────────────────────────────────
-- Per-section ticks and one-line notes. `section_index` matches REVIEW_SECTIONS in the repo, and
-- `section_label` is stored alongside it so a row still reads correctly if that list is reordered
-- later — an index alone would silently point at a different section.
create table if not exists review.section_checks (
  path          text not null references review.pages(path) on delete cascade,
  section_index integer not null,
  section_label text not null,
  checked       boolean not null default false,
  note          text not null default '',
  updated_by    uuid references auth.users(id),
  updated_at    timestamptz not null default now(),
  primary key (path, section_index)
);

-- ── EDIT REQUESTS — the CMS part ─────────────────────────────────────────────────────────────
-- "Request an edit on this page." The thing the board exists for: someone reads a page, wants copy
-- or design changed, and files it against that page and optionally that section.
create table if not exists review.edit_requests (
  id            bigint generated always as identity primary key,
  path          text not null references review.pages(path) on delete cascade,
  section_label text,
  kind          text not null default 'copy' check (kind in ('copy','design','data','bug','question')),
  title         text not null,
  body          text not null default '',
  status        text not null default 'open' check (status in ('open','in_progress','blocked','done','wontfix')),
  priority      text not null default 'normal' check (priority in ('low','normal','high')),
  created_by    uuid not null default auth.uid() references auth.users(id),
  assigned_to   uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists edit_requests_path_idx on review.edit_requests (path);
create index if not exists edit_requests_status_idx on review.edit_requests (status);

-- ── COMMENTS ─────────────────────────────────────────────────────────────────────────────────
create table if not exists review.comments (
  id         bigint generated always as identity primary key,
  request_id bigint not null references review.edit_requests(id) on delete cascade,
  body       text not null,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists comments_request_idx on review.comments (request_id);

-- ── updated_at, maintained by the database ───────────────────────────────────────────────────
-- Set in a trigger rather than by the client: a client that forgets is a row that lies about when
-- it last changed, and this is the column the board sorts and reconciles on.
create or replace function review.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists t_page_status_touch on review.page_status;
create trigger t_page_status_touch before update on review.page_status
  for each row execute function review.touch_updated_at();
drop trigger if exists t_section_checks_touch on review.section_checks;
create trigger t_section_checks_touch before update on review.section_checks
  for each row execute function review.touch_updated_at();
drop trigger if exists t_edit_requests_touch on review.edit_requests;
create trigger t_edit_requests_touch before update on review.edit_requests
  for each row execute function review.touch_updated_at();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────────────────────
-- DENY BY DEFAULT ON EVERY TABLE. Enabling RLS without policies denies everything, which is the
-- correct starting point; each policy below opens exactly one door.
alter table review.pages          enable row level security;
alter table review.page_status    enable row level security;
alter table review.section_checks enable row level security;
alter table review.edit_requests  enable row level security;
alter table review.comments       enable row level security;

-- Signed-in team members can read everything. This is a shared board — a review nobody else can see
-- is the localStorage version with extra steps.
drop policy if exists p_read on review.pages;
create policy p_read on review.pages for select to authenticated using (true);
drop policy if exists ps_read on review.page_status;
create policy ps_read on review.page_status for select to authenticated using (true);
drop policy if exists sc_read on review.section_checks;
create policy sc_read on review.section_checks for select to authenticated using (true);
drop policy if exists er_read on review.edit_requests;
create policy er_read on review.edit_requests for select to authenticated using (true);
drop policy if exists c_read on review.comments;
create policy c_read on review.comments for select to authenticated using (true);

-- Any signed-in member can tick, note and file requests. The team is small and trusted; the line
-- that matters is signed-in vs not, not member vs member.
drop policy if exists ps_write on review.page_status;
create policy ps_write on review.page_status for all to authenticated using (true) with check (true);
drop policy if exists sc_write on review.section_checks;
create policy sc_write on review.section_checks for all to authenticated using (true) with check (true);
drop policy if exists er_insert on review.edit_requests;
create policy er_insert on review.edit_requests for insert to authenticated with check (created_by = auth.uid());
drop policy if exists er_update on review.edit_requests;
create policy er_update on review.edit_requests for update to authenticated using (true) with check (true);

-- COMMENTS ARE APPEND-ONLY, AND DELIBERATELY SO. There is no update or delete policy: an edit
-- request's thread is the record of what the team decided, and a record someone can quietly rewrite
-- is not a record. Author only, so nobody can post as someone else.
drop policy if exists c_insert on review.comments;
create policy c_insert on review.comments for insert to authenticated with check (created_by = auth.uid());

-- `pages` is written by the build, not by people — no insert/update policy for authenticated. The
-- sync runs with the service-role key, which bypasses RLS by design.

-- The sync script writes with the service-role key, which bypasses RLS but still needs USAGE on the
-- schema — a grant it does not inherit. `anon` is granted NOTHING here, deliberately: an anonymous
-- caller is refused at the schema boundary rather than by a row filter, which is a shorter path to
-- the same answer and one fewer thing that can be misconfigured.
grant usage on schema review to service_role;
grant all on all tables in schema review to service_role;
grant all on all sequences in schema review to service_role;

grant usage on schema review to authenticated;
grant select on all tables in schema review to authenticated;
grant insert, update on review.page_status, review.section_checks, review.edit_requests to authenticated;
grant insert on review.comments to authenticated;
grant usage, select on all sequences in schema review to authenticated;
