-- ============================================================
-- Aromaz CRM — Phase 1 Schema
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── ENUMS ────────────────────────────────────────────────────
create type user_role as enum ('admin','sales','contractor','warehouse','accounting');
create type lead_stage as enum ('new','contacted','qualified','won','lost');
create type lead_priority as enum ('low','medium','high');
create type quote_status as enum ('draft','sent','viewed','signed','expired','converted');
create type invoice_status as enum ('draft','sent','signed','paid','partial','overdue','void');
create type product_type as enum ('inventory','non_inventory','service');

-- ── USERS ────────────────────────────────────────────────────
create table users (
  id          uuid primary key default uuid_generate_v4(),
  email       text unique not null,
  name        text not null,
  role        user_role not null default 'sales',
  location_id uuid,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── LEADS ────────────────────────────────────────────────────
create table leads (
  id                   uuid primary key default uuid_generate_v4(),
  name                 text not null,
  email                text,
  phone                text,
  source               text,           -- 'google_ads','referral','walk_in','instagram', etc.
  stage                lead_stage not null default 'new',
  priority             lead_priority not null default 'medium',
  assigned_to_id       uuid references users(id) on delete set null,
  notes                text,
  converted_customer_id uuid,          -- set on conversion
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index leads_stage_idx on leads(stage);
create index leads_assigned_idx on leads(assigned_to_id);

-- auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger leads_updated_at before update on leads
  for each row execute procedure set_updated_at();

-- ── LEAD INTERACTIONS ────────────────────────────────────────
create table lead_interactions (
  id         uuid primary key default uuid_generate_v4(),
  lead_id    uuid not null references leads(id) on delete cascade,
  type       text not null,   -- 'call','email','visit','note'
  content    text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── CUSTOMERS ────────────────────────────────────────────────
create table customers (
  id           uuid primary key default uuid_generate_v4(),
  display_name text not null,
  tax_id       text,
  email        text,
  phone        text,
  address      text,
  city         text,
  notes        text,
  created_at   timestamptz not null default now()
);

create index customers_name_idx on customers(display_name);

-- ── PRODUCTS ─────────────────────────────────────────────────
create table products (
  id          uuid primary key default uuid_generate_v4(),
  sku         text unique not null,
  name        text not null,
  type        product_type not null default 'inventory',
  uom         text not null default 'sqft',
  cost        numeric(12,2) not null default 0,
  price       numeric(12,2) not null default 0,
  category    text,
  track_stock boolean not null default true,
  stock_qty   numeric(12,2) not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index products_category_idx on products(category);
create index products_active_idx on products(active);

-- ── QUOTES ───────────────────────────────────────────────────
create table quotes (
  id                   uuid primary key default uuid_generate_v4(),
  number               text unique not null,
  customer_id          uuid not null references customers(id) on delete restrict,
  status               quote_status not null default 'draft',
  subtotal             numeric(12,2) not null default 0,
  tax_total            numeric(12,2) not null default 0,
  total                numeric(12,2) not null default 0,
  valid_until          date,
  notes                text,
  created_by_id        uuid references users(id) on delete set null,
  converted_invoice_id uuid,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger quotes_updated_at before update on quotes
  for each row execute procedure set_updated_at();

create table quote_lines (
  id           uuid primary key default uuid_generate_v4(),
  quote_id     uuid not null references quotes(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  description  text not null,
  qty          numeric(12,4) not null default 1,
  unit_price   numeric(12,2) not null default 0,
  discount_pct numeric(5,2) not null default 0,
  tax_pct      numeric(5,2) not null default 0,
  total        numeric(12,2) not null default 0,
  sort_order   integer not null default 0
);

create index quote_lines_quote_idx on quote_lines(quote_id);

-- ── INVOICES ─────────────────────────────────────────────────
create table invoices (
  id             uuid primary key default uuid_generate_v4(),
  number         text unique not null,
  customer_id    uuid not null references customers(id) on delete restrict,
  quote_id       uuid references quotes(id) on delete set null,
  status         invoice_status not null default 'draft',
  subtotal       numeric(12,2) not null default 0,
  tax_total      numeric(12,2) not null default 0,
  total          numeric(12,2) not null default 0,
  amount_paid    numeric(12,2) not null default 0,
  due_date       date not null,
  notes          text,
  created_by_id  uuid references users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger invoices_updated_at before update on invoices
  for each row execute procedure set_updated_at();

create index invoices_customer_idx on invoices(customer_id);
create index invoices_status_idx on invoices(status);

create table invoice_lines (
  id           uuid primary key default uuid_generate_v4(),
  invoice_id   uuid not null references invoices(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  description  text not null,
  qty          numeric(12,4) not null default 1,
  unit_price   numeric(12,2) not null default 0,
  discount_pct numeric(5,2) not null default 0,
  tax_pct      numeric(5,2) not null default 0,
  total        numeric(12,2) not null default 0,
  sort_order   integer not null default 0
);

-- ── RLS POLICIES ─────────────────────────────────────────────
-- Enable RLS on all tables
alter table users enable row level security;
alter table leads enable row level security;
alter table lead_interactions enable row level security;
alter table customers enable row level security;
alter table products enable row level security;
alter table quotes enable row level security;
alter table quote_lines enable row level security;
alter table invoices enable row level security;
alter table invoice_lines enable row level security;

-- Admins see everything; sales see their own leads/quotes
-- (Expand these policies as RBAC grows)
create policy "authenticated users read users"
  on users for select using (auth.role() = 'authenticated');

create policy "authenticated users read leads"
  on leads for select using (auth.role() = 'authenticated');

create policy "authenticated users write leads"
  on leads for all using (auth.role() = 'authenticated');

create policy "authenticated users read customers"
  on customers for select using (auth.role() = 'authenticated');

create policy "authenticated users write customers"
  on customers for all using (auth.role() = 'authenticated');

create policy "authenticated read products"
  on products for select using (auth.role() = 'authenticated');

create policy "authenticated write products"
  on products for all using (auth.role() = 'authenticated');

create policy "authenticated read quotes"
  on quotes for select using (auth.role() = 'authenticated');

create policy "authenticated write quotes"
  on quotes for all using (auth.role() = 'authenticated');

create policy "authenticated read quote_lines"
  on quote_lines for select using (auth.role() = 'authenticated');

create policy "authenticated write quote_lines"
  on quote_lines for all using (auth.role() = 'authenticated');

create policy "authenticated read invoices"
  on invoices for select using (auth.role() = 'authenticated');

create policy "authenticated write invoices"
  on invoices for all using (auth.role() = 'authenticated');

create policy "authenticated read invoice_lines"
  on invoice_lines for select using (auth.role() = 'authenticated');

-- ── SEQUENCE FOR DOCUMENT NUMBERS ────────────────────────────
create sequence quote_number_seq start 1000;
create sequence invoice_number_seq start 2000;

create or replace function next_quote_number()
returns text language sql as $$
  select 'QT-' || lpad(nextval('quote_number_seq')::text, 5, '0');
$$;

create or replace function next_invoice_number()
returns text language sql as $$
  select 'INV-' || lpad(nextval('invoice_number_seq')::text, 5, '0');
$$;
