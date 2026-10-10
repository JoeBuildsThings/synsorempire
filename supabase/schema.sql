-- Synsorempire database schema. Run once in the Supabase SQL Editor on a new project.

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0
);

create sequence product_code_seq start 1;

create table products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('SYN' || lpad(nextval('product_code_seq')::text, 4, '0')),
  category_id uuid references categories(id),
  subcategory text,
  name text not null,
  slug text not null unique,
  description text,
  price_ngn integer,
  status text not null default 'available'
    check (status in ('available', 'sold_out', 'ask')),
  sizes text[] not null default '{}',
  featured boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  path text not null,
  sort_order int not null default 0
);

create table order_intents (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null,
  created_at timestamptz not null default now()
);

create table admins (
  user_id uuid primary key references auth.users(id)
);

grant usage, select on sequence product_code_seq to authenticated;
alter sequence product_code_seq owned by products.code;

create function public.is_admin() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table order_intents enable row level security;
alter table admins enable row level security;

create policy "public read categories" on categories
  for select using (true);
create policy "public read products" on products
  for select using (is_archived = false or public.is_admin());
create policy "public read images" on product_images
  for select using (true);
create policy "admin write categories" on categories
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write products" on products
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write images" on product_images
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin reads intents" on order_intents
  for select using (public.is_admin());

insert into categories (name, slug, sort_order) values
  ('Corporate Wear', 'corporate_wear', 1),
  ('Corporate Shoes', 'corporate_shoes', 2),
  ('Sneakers & Casual Footwear', 'sneakers_casual', 3),
  ('Streetwear', 'streetwear', 4),
  ('Caps & Headwear', 'caps_headwear', 5),
  ('Belts', 'belts', 6),
  ('Bags', 'bags', 7),
  ('Essentials', 'essentials', 8);

-- After creating the owner account in Supabase Authentication, make it an admin:
-- insert into admins (user_id) values ('PASTE_USER_ID_HERE');
