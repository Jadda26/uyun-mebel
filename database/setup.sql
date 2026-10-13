-- =====================================================================
-- setup.sql  –  MEMBUAT DATABASE WEBSITE UYUN MEBEL (dijalankan SEKALI)
--
-- Cara pakai: Supabase > menu "SQL Editor" > New query > tempel seluruh isi file ini > tekan Run.
-- File ini aman dijalankan ulang (tidak menghapus data yang sudah ada).
-- =====================================================================

-- 1) Tabel produk ------------------------------------------------------
create table if not exists public.produk (
  id               uuid primary key default gen_random_uuid(),
  nama             text not null,
  kategori         text not null check (kategori in ('kasur', 'sofa', 'mebel')),
  harga            bigint,                                   -- kosong = tampil "Hubungi kami untuk harga"
  harga_mulai_dari boolean not null default false,           -- true = tampil "Mulai dari Rp ..."
  ukuran           text,
  bahan            text,
  warna            text,
  deskripsi        text,
  foto             text[] not null default '{}',             -- daftar link foto, yang pertama = foto utama
  status           text not null default 'ready' check (status in ('ready', 'pre-order', 'habis')),
  unggulan         boolean not null default false,           -- true = tampil di beranda
  tampil           boolean not null default true,            -- false = disembunyikan dari website
  dibuat           timestamptz not null default now()
);

-- 2) Aturan keamanan (Row Level Security) ------------------------------
-- Pengunjung hanya boleh MELIHAT produk yang tampil. Hanya admin (sudah login) yang boleh mengubah.
alter table public.produk enable row level security;

drop policy if exists "Pengunjung melihat produk tampil" on public.produk;
create policy "Pengunjung melihat produk tampil"
  on public.produk for select
  to anon, authenticated
  using (tampil = true);

drop policy if exists "Admin melihat semua produk" on public.produk;
create policy "Admin melihat semua produk"
  on public.produk for select
  to authenticated
  using (true);

drop policy if exists "Admin menambah produk" on public.produk;
create policy "Admin menambah produk"
  on public.produk for insert
  to authenticated
  with check (true);

drop policy if exists "Admin mengubah produk" on public.produk;
create policy "Admin mengubah produk"
  on public.produk for update
  to authenticated
  using (true) with check (true);

drop policy if exists "Admin menghapus produk" on public.produk;
create policy "Admin menghapus produk"
  on public.produk for delete
  to authenticated
  using (true);

-- 3) Tempat penyimpanan foto ------------------------------------------
insert into storage.buckets (id, name, public)
values ('foto-produk', 'foto-produk', true)
on conflict (id) do nothing;

drop policy if exists "Foto produk bisa dilihat semua orang" on storage.objects;
create policy "Foto produk bisa dilihat semua orang"
  on storage.objects for select
  using (bucket_id = 'foto-produk');

drop policy if exists "Admin mengunggah foto" on storage.objects;
create policy "Admin mengunggah foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'foto-produk');

drop policy if exists "Admin mengubah foto" on storage.objects;
create policy "Admin mengubah foto"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'foto-produk');

drop policy if exists "Admin menghapus foto" on storage.objects;
create policy "Admin menghapus foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'foto-produk');
