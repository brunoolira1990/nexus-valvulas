-- Normalize product assets and variants
-- Tables: product_images, product_pdfs, product_variants, variant_drawings

-- Products table assumed to exist

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position int not null default 0,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_product_images_product on public.product_images(product_id);

create table if not exists public.product_pdfs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position int not null default 0,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_product_pdfs_product on public.product_pdfs(product_id);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  type text not null,
  size text not null,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_product_variants_product on public.product_variants(product_id);
create index if not exists idx_product_variants_type_size on public.product_variants(type, size);

create table if not exists public.variant_drawings (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  url text not null,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_variant_drawings_variant on public.variant_drawings(variant_id);

-- Enable RLS
alter table public.product_images enable row level security;
alter table public.product_pdfs enable row level security;
alter table public.product_variants enable row level security;
alter table public.variant_drawings enable row level security;

-- Public read policies
create policy if not exists "public read product_images" on public.product_images for select using (true);
create policy if not exists "public read product_pdfs" on public.product_pdfs for select using (true);
create policy if not exists "public read product_variants" on public.product_variants for select using (true);
create policy if not exists "public read variant_drawings" on public.variant_drawings for select using (true);

-- Admin write policies (requires profiles table with role='admin')
create policy if not exists "admin write product_images" on public.product_images for all using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

create policy if not exists "admin write product_pdfs" on public.product_pdfs for all using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

create policy if not exists "admin write product_variants" on public.product_variants for all using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
);

create policy if not exists "admin write variant_drawings" on public.variant_drawings for all using (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin')
); 