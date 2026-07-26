-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Custom Types (Enums)
CREATE TYPE user_role AS ENUM ('citizen', 'officer');
CREATE TYPE fir_status AS ENUM ('Pending Verification', 'Verified & Active', 'Closed', 'Pending Assignment', 'Under Investigation');
CREATE TYPE fir_severity AS ENUM ('High', 'Medium', 'Low');

-- 2. Tables

-- Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'citizen',
    name TEXT NOT NULL,
    station TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- FIRs Table
CREATE TABLE public.firs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date_filed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    station TEXT NOT NULL,
    status fir_status NOT NULL DEFAULT 'Pending Verification',
    severity fir_severity NOT NULL DEFAULT 'Medium',
    type TEXT NOT NULL,
    citizen_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_officer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firs ENABLE ROW LEVEL SECURITY;

-- Users policies
-- Allow everyone to read users (for simplicity, but can be restricted in prod)
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
-- Allow public insert (since we have a sign up page)
CREATE POLICY "Allow public insert to users" ON public.users FOR INSERT WITH CHECK (true);

-- FIRs policies
-- Allow public read access to FIRs (or restrict to citizen who created it + officers)
CREATE POLICY "Allow public read access to FIRs" ON public.firs FOR SELECT USING (true);
-- Allow citizens to create FIRs
CREATE POLICY "Allow public insert to FIRs" ON public.firs FOR INSERT WITH CHECK (true);
-- Allow officers to update FIRs
CREATE POLICY "Allow public update to FIRs" ON public.firs FOR UPDATE USING (true);

-- 4. Triggers for updated_at

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users
CREATE TRIGGER on_users_updated
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger for firs
CREATE TRIGGER on_firs_updated
    BEFORE UPDATE ON public.firs
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 5. Indexes for performance
CREATE INDEX idx_firs_station ON public.firs(station);
CREATE INDEX idx_firs_status ON public.firs(status);
CREATE INDEX idx_firs_citizen_id ON public.firs(citizen_id);
CREATE INDEX idx_users_role ON public.users(role);

-- 6. Seed Data (Optional)
INSERT INTO public.users (id, role, name, station) VALUES 
('11111111-1111-1111-1111-111111111111', 'officer', 'Inspector Sharma', 'Central Zone'),
('22222222-2222-2222-2222-222222222222', 'citizen', 'Rahul Kumar', NULL);

INSERT INTO public.firs (fir_number, title, description, station, status, severity, type, citizen_id) VALUES 
('FIR-2023-001', 'Stolen Vehicle', 'My motorcycle was stolen from the parking lot.', 'Central Zone', 'Pending Verification', 'High', 'Theft', '22222222-2222-2222-2222-222222222222'),
('FIR-2023-002', 'Lost Wallet', 'Lost my wallet containing ID cards near the market.', 'North Zone', 'Verified & Active', 'Low', 'Lost Property', '22222222-2222-2222-2222-222222222222');
