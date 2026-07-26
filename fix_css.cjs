-- 1. Update the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- 2. Add new columns to the existing users table
ALTER TABLE public.users
ADD COLUMN phone TEXT,
ADD COLUMN email TEXT,
ADD COLUMN area TEXT,
ADD COLUMN password TEXT;

-- 3. Add new columns to the existing firs table
ALTER TABLE public.firs
ADD COLUMN location TEXT,
ADD COLUMN incident_date TEXT,
ADD COLUMN incident_time TEXT,
ADD COLUMN ai_analysis JSONB;

-- 4. Create table for FIR Notes
CREATE TABLE public.fir_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id UUID REFERENCES public.firs(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create table for FIR Evidence
CREATE TABLE public.fir_evidence (
    id TEXT PRIMARY KEY, -- using TEXT because the app uses "EVID-..." ids
    fir_id UUID REFERENCES public.firs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create table for FIR Entities (Graph Nodes)
CREATE TABLE public.fir_entities (
    id TEXT PRIMARY KEY, -- String ID like "Suspect A" from the UI
    fir_id UUID REFERENCES public.firs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('suspect', 'victim', 'location', 'mo', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create table for FIR Links (Graph Edges)
CREATE TABLE public.fir_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fir_id UUID REFERENCES public.firs(id) ON DELETE CASCADE,
    source TEXT NOT NULL, -- references fir_entities(id) but kept as TEXT for flexibility
    target TEXT NOT NULL,
    value INTEGER DEFAULT 1,
    relationship TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Enable Row Level Security (RLS) on new tables
ALTER TABLE public.fir_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fir_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fir_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fir_links ENABLE ROW LEVEL SECURITY;

-- 9. Add permissive public policies (for development/testing)
CREATE POLICY "Allow public read access to fir_notes" ON public.fir_notes FOR SELECT USING (true);
CREATE POLICY "Allow public insert to fir_notes" ON public.fir_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to fir_notes" ON public.fir_notes FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to fir_evidence" ON public.fir_evidence FOR SELECT USING (true);
CREATE POLICY "Allow public insert to fir_evidence" ON public.fir_evidence FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to fir_evidence" ON public.fir_evidence FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to fir_entities" ON public.fir_entities FOR SELECT USING (true);
CREATE POLICY "Allow public insert to fir_entities" ON public.fir_entities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to fir_entities" ON public.fir_entities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to fir_entities" ON public.fir_entities FOR DELETE USING (true);

CREATE POLICY "Allow public read access to fir_links" ON public.fir_links FOR SELECT USING (true);
CREATE POLICY "Allow public insert to fir_links" ON public.fir_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to fir_links" ON public.fir_links FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to fir_links" ON public.fir_links FOR DELETE USING (true);
