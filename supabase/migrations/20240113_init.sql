-- Create tables based on types/index.ts

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS / PROFILES (Links to auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('ADMIN', 'OWNER', 'RENTER')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- CARS
create table public.cars (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) not null,
  make text not null,
  model text not null,
  year int not null,
  transmission text check (transmission in ('Automatic', 'Manual')),
  seats int not null,
  mileage int not null,
  description text,
  base_price numeric not null,
  images text[],
  documents text[],
  status text check (status in ('PENDING', 'APPROVED', 'REJECTED')) default 'PENDING',
  location text not null,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.cars enable row level security;

create policy "Cars are viewable by everyone."
  on public.cars for select
  using ( true );

create policy "Owners can insert their own cars."
  on public.cars for insert
  with check ( auth.uid() = owner_id );

create policy "Owners can update their own cars."
  on public.cars for update
  using ( auth.uid() = owner_id );

-- BOOKINGS
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  renter_id uuid references public.profiles(id) not null,
  car_id uuid references public.cars(id) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  total_price numeric not null,
  status text check (status in ('PENDING', 'PAID', 'CANCELLED', 'COMPLETED')) default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bookings enable row level security;

create policy "Users can view their own bookings (renter or owner)."
  on public.bookings for select
  using ( 
    auth.uid() = renter_id or 
    exists (
      select 1 from public.cars 
      where cars.id = bookings.car_id and cars.owner_id = auth.uid()
    )
  );

create policy "Renters can create bookings."
  on public.bookings for insert
  with check ( auth.uid() = renter_id );

-- TRANSACTIONS
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) not null,
  amount numeric not null,
  payment_status text check (payment_status in ('success', 'failed', 'pending')) default 'pending',
  payout_status text check (payout_status in ('pending', 'paid')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.transactions enable row level security;

create policy "Users can view their own transactions."
  on public.transactions for select
  using (
    exists (
      select 1 from public.bookings
      where bookings.id = transactions.booking_id and (
        bookings.renter_id = auth.uid() or
        exists (
          select 1 from public.cars
          where cars.id = bookings.car_id and cars.owner_id = auth.uid()
        )
      )
    )
  );

-- GLOBAL RULES
create table public.global_rules (
  id int primary key default 1,
  weekend_multiplier numeric default 1.0,
  seasonal_multiplier numeric default 1.0,
  deposit_fee numeric default 0,
  constraint single_row check (id = 1)
);

alter table public.global_rules enable row level security;

create policy "Rules are viewable by everyone."
  on public.global_rules for select
  using ( true );

-- Insert default rules
insert into public.global_rules (weekend_multiplier, seasonal_multiplier, deposit_fee)
values (1.2, 1.1, 500)
on conflict (id) do nothing;
