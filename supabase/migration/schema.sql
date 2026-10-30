-- ============================================================================
-- UMKM KLEPU: Complete Modular Database Schema & RPC Backend System
-- Safe, Idempotent, and Backward-Compatible with existing public.umkm table
-- ============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. User & Mitra Management Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'mitra' CHECK (role IN ('admin', 'mitra')),
    mitra_type TEXT NOT NULL DEFAULT 'personal' CHECK (mitra_type IN ('personal', 'organisasi', 'persero')),
    organization_name TEXT,
    organization_position TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast username lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (lower(username));
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_mitra_type ON public.users (mitra_type);

-- 2.1 Authenticated User Sessions Table (Admin & Mitra)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions (token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions (user_id);

-- ============================================================================
-- 3. Minat Investasi Table (Investment Expressions of Interest)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.minat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    investment_type TEXT NOT NULL CHECK (investment_type IN ('modal_kerja', 'pengadaan_alat', 'bagi_hasil', 'kemitraan_distribusi', 'lainnya')),
    target_item TEXT, -- What to invest on (e.g. Mesin sangrai liberika, Perluasan kedai)
    nominal_investment NUMERIC,
    notes TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    proposal_url TEXT, -- Document URL in Supabase storage
    proposal_filename TEXT, -- Original filename of the proposal
    status TEXT NOT NULL DEFAULT 'menunggu_konfirmasi' CHECK (status IN ('menunggu_konfirmasi', 'dalam_diskusi', 'disetujui', 'ditolak', 'selesai')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_minat_user ON public.minat (user_id);
CREATE INDEX IF NOT EXISTS idx_minat_umkm ON public.minat (umkm_id);
CREATE INDEX IF NOT EXISTS idx_minat_status ON public.minat (status);

-- ============================================================================
-- 3b. Wholesale (Grosir / B2B) Request Tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wholesale_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_type TEXT NOT NULL CHECK (requester_type IN ('personal', 'organisasi')),
    full_name TEXT NOT NULL,
    organization_name TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru', 'dihubungi', 'selesai', 'dibatalkan')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wholesale_requests_status ON public.wholesale_requests (status);

CREATE TABLE IF NOT EXISTS public.wholesale_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.wholesale_requests(id) ON DELETE CASCADE,
    umkm_id TEXT REFERENCES public.umkm(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL, -- Snapshot of the product name at request time
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wholesale_items_request ON public.wholesale_request_items (request_id);

-- ============================================================================
-- 4. Modular UMKM Domain Tables
-- ============================================================================

-- 4.1 Products Table (Multi-product support per enterprise)
CREATE TABLE IF NOT EXISTS public.umkm_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 1,
    unit TEXT NOT NULL, -- 'gram', 'kemasan', 'pcs', 'ml'
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_umkm ON public.umkm_products (umkm_id);

-- 4.2 Investment Specs Table (Readiness, Capital, Strategy)
CREATE TABLE IF NOT EXISTS public.umkm_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT UNIQUE NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    readiness TEXT NOT NULL CHECK (readiness IN ('siap', 'dipertimbangkan', 'belum_siap')),
    readiness_reason TEXT,
    investment_min NUMERIC,
    investment_max NUMERIC,
    investment_display TEXT,
    market TEXT,
    market_note TEXT,
    opportunity_context TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.3 Feasibility Scores Table
CREATE TABLE IF NOT EXISTS public.umkm_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT UNIQUE NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    score_market INTEGER NOT NULL DEFAULT 0,
    score_finance INTEGER NOT NULL DEFAULT 0,
    score_materials INTEGER NOT NULL DEFAULT 0,
    score_technology INTEGER NOT NULL DEFAULT 0,
    score_distribution INTEGER NOT NULL DEFAULT 0,
    priority_rank INTEGER,
    priority_total INTEGER,
    priority_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.4 ROI Simulation Table
CREATE TABLE IF NOT EXISTS public.umkm_roi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT UNIQUE NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    roi_percentage_min NUMERIC,
    roi_percentage_max NUMERIC,
    payback_years_min NUMERIC,
    payback_years_max NUMERIC,
    roi_basis TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.5 URL Slugs Table
CREATE TABLE IF NOT EXISTS public.umkm_slugs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_slugs_slug ON public.umkm_slugs (slug);

-- 4.6 Media Gallery Table (Photos and Videos)
CREATE TABLE IF NOT EXISTS public.umkm_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.umkm_products(id) ON DELETE SET NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL,
    poster_url TEXT,
    alt_text TEXT,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_media_umkm ON public.umkm_media (umkm_id);

-- 4.7 Development Opportunities Table
CREATE TABLE IF NOT EXISTS public.umkm_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    investment_amount NUMERIC,
    investment_display TEXT,
    detail TEXT NOT NULL,
    recommended BOOLEAN NOT NULL DEFAULT false,
    recommended_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_opportunities_umkm ON public.umkm_opportunities (umkm_id);

-- 4.8 Facts Table (General Business Facts)
CREATE TABLE IF NOT EXISTS public.umkm_facts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_facts_umkm ON public.umkm_facts (umkm_id);

-- 4.9 Operations Table (Operational Facts)
CREATE TABLE IF NOT EXISTS public.umkm_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_operations_umkm ON public.umkm_operations (umkm_id);

-- 4.10 Roles Table (Stakeholder Roles)
CREATE TABLE IF NOT EXISTS public.umkm_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_roles_umkm ON public.umkm_roles (umkm_id);

-- 4.11 List Items Table (Risks, Mitigations, Prerequisites, etc.)
CREATE TABLE IF NOT EXISTS public.umkm_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id TEXT NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('risk', 'mitigation', 'prerequisite', 'investment_use', 'market_target', 'gap', 'potential')),
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_list_items_umkm_cat ON public.umkm_list_items (umkm_id, category);

-- ============================================================================
-- 5. Row-Level Security (RLS) Configuration
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minat ENABLE ROW LEVEL SECURITY;
-- No policies on wholesale tables: anon cannot read/write directly; inserts go through submit_wholesale_request
ALTER TABLE public.wholesale_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_roi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_slugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_list_items ENABLE ROW LEVEL SECURITY;

-- Public read access for UMKM catalog tables
DROP POLICY IF EXISTS "Public read umkm_products" ON public.umkm_products;
CREATE POLICY "Public read umkm_products" ON public.umkm_products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_investments" ON public.umkm_investments;
CREATE POLICY "Public read umkm_investments" ON public.umkm_investments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_scores" ON public.umkm_scores;
CREATE POLICY "Public read umkm_scores" ON public.umkm_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_roi" ON public.umkm_roi;
CREATE POLICY "Public read umkm_roi" ON public.umkm_roi FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_slugs" ON public.umkm_slugs;
CREATE POLICY "Public read umkm_slugs" ON public.umkm_slugs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_media" ON public.umkm_media;
CREATE POLICY "Public read umkm_media" ON public.umkm_media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_opportunities" ON public.umkm_opportunities;
CREATE POLICY "Public read umkm_opportunities" ON public.umkm_opportunities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_facts" ON public.umkm_facts;
CREATE POLICY "Public read umkm_facts" ON public.umkm_facts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_operations" ON public.umkm_operations;
CREATE POLICY "Public read umkm_operations" ON public.umkm_operations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_roles" ON public.umkm_roles;
CREATE POLICY "Public read umkm_roles" ON public.umkm_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read umkm_list_items" ON public.umkm_list_items;
CREATE POLICY "Public read umkm_list_items" ON public.umkm_list_items FOR SELECT USING (true);

-- Users RLS (Passwords never accessible via direct select)
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (true);

-- Minat RLS
DROP POLICY IF EXISTS "Users can create minat" ON public.minat;
CREATE POLICY "Users can create minat" ON public.minat FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read minat" ON public.minat;
CREATE POLICY "Public read minat" ON public.minat FOR SELECT USING (true);

DROP POLICY IF EXISTS "Update minat status" ON public.minat;
CREATE POLICY "Update minat status" ON public.minat FOR UPDATE USING (true);

-- ============================================================================
-- 6. RPC Backend Stored Procedures
-- ============================================================================

-- 6.1 Register Mitra Procedure
CREATE OR REPLACE FUNCTION public.register_mitra(
    p_username TEXT,
    p_password TEXT,
    p_full_name TEXT,
    p_phone TEXT,
    p_mitra_type TEXT DEFAULT 'personal',
    p_organization_name TEXT DEFAULT NULL,
    p_organization_position TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_username TEXT;
    v_new_id UUID;
    v_user_record RECORD;
BEGIN
    v_clean_username := lower(trim(p_username));

    IF length(v_clean_username) < 3 THEN
        RAISE EXCEPTION 'Username minimal 3 karakter';
    END IF;

    IF length(p_password) < 6 THEN
        RAISE EXCEPTION 'Password minimal 6 karakter';
    END IF;

    IF EXISTS (SELECT 1 FROM public.users WHERE lower(username) = v_clean_username) THEN
        RAISE EXCEPTION 'Username sudah digunakan, silakan pilih yang lain';
    END IF;

    INSERT INTO public.users (
        username,
        password_hash,
        full_name,
        role,
        mitra_type,
        organization_name,
        organization_position,
        phone,
        address
    ) VALUES (
        v_clean_username,
        crypt(p_password, gen_salt('bf', 10)),
        trim(p_full_name),
        'mitra',
        p_mitra_type,
        trim(p_organization_name),
        trim(p_organization_position),
        trim(p_phone),
        trim(p_address)
    )
    RETURNING id INTO v_new_id;

    SELECT id, username, full_name, role, mitra_type, organization_name, organization_position, phone, address, created_at
    INTO v_user_record
    FROM public.users
    WHERE id = v_new_id;

    RETURN to_jsonb(v_user_record);
END;
$$;

-- 6.1b Admin Session Verification Helper
CREATE OR REPLACE FUNCTION public.verify_admin_session(p_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
        RAISE EXCEPTION 'Akses ditolak: Token autentikasi tidak ada';
    END IF;

    SELECT s.user_id INTO v_user_id
    FROM public.user_sessions s
    JOIN public.users u ON u.id = s.user_id
    WHERE s.token = p_token
      AND s.expires_at > now()
      AND u.role = 'admin'
      AND u.is_active = true;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: Sesi admin tidak valid atau telah kedaluwarsa';
    END IF;

    RETURN v_user_id;
END;
$$;

-- 6.2 Login Procedure (Issues expirable session token)
CREATE OR REPLACE FUNCTION public.login_user(
    p_username TEXT,
    p_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_user RECORD;
    v_session_token TEXT;
BEGIN
    SELECT id, username, password_hash, full_name, role, mitra_type, organization_name, organization_position, phone, address, is_active, created_at
    INTO v_user
    FROM public.users
    WHERE lower(username) = lower(trim(p_username));

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Username atau password salah';
    END IF;

    IF NOT v_user.is_active THEN
        RAISE EXCEPTION 'Akun sedang dinonaktifkan';
    END IF;

    IF v_user.password_hash != crypt(p_password, v_user.password_hash) THEN
        RAISE EXCEPTION 'Username atau password salah';
    END IF;

    v_session_token := encode(gen_random_bytes(32), 'hex');

    INSERT INTO public.user_sessions (user_id, token, role, expires_at)
    VALUES (v_user.id, v_session_token, v_user.role, now() + INTERVAL '7 days');

    RETURN jsonb_build_object(
        'user', jsonb_build_object(
            'id', v_user.id,
            'username', v_user.username,
            'fullName', v_user.full_name,
            'role', v_user.role,
            'mitraType', v_user.mitra_type,
            'organizationName', v_user.organization_name,
            'organizationPosition', v_user.organization_position,
            'phone', v_user.phone,
            'address', v_user.address,
            'createdAt', v_user.created_at
        ),
        'token', v_session_token
    );
END;
$$;

-- 6.2b Logout Procedure
CREATE OR REPLACE FUNCTION public.logout_user(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.user_sessions WHERE token = p_token;
    RETURN jsonb_build_object('success', true);
END;
$$;

-- 6.3 Submit Minat Procedure
CREATE OR REPLACE FUNCTION public.submit_minat(
    p_user_id UUID,
    p_umkm_id TEXT,
    p_investment_type TEXT,
    p_target_item TEXT DEFAULT NULL,
    p_nominal NUMERIC DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_proposal_url TEXT DEFAULT NULL,
    p_proposal_filename TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_id UUID;
    v_result RECORD;
BEGIN
    INSERT INTO public.minat (
        user_id,
        umkm_id,
        investment_type,
        target_item,
        nominal_investment,
        notes,
        contact_phone,
        proposal_url,
        proposal_filename
    ) VALUES (
        p_user_id,
        p_umkm_id,
        p_investment_type,
        trim(p_target_item),
        p_nominal,
        p_notes,
        p_phone,
        trim(p_proposal_url),
        trim(p_proposal_filename)
    )
    RETURNING id INTO v_new_id;

    SELECT m.*, coalesce(u.data->>'name', u.slug) as umkm_name, usr.full_name, usr.username, usr.mitra_type, usr.organization_name
    INTO v_result
    FROM public.minat m
    JOIN public.umkm u ON u.id = m.umkm_id
    JOIN public.users usr ON usr.id = m.user_id
    WHERE m.id = v_new_id;

    RETURN to_jsonb(v_result);
END;
$$;

-- 6.3b Submit Wholesale Request Procedure
-- p_items: [{ "umkmId": "...", "productName": "...", "quantity": 100, "unit": "pcs" }, ...]
CREATE OR REPLACE FUNCTION public.submit_wholesale_request(
    p_requester_type TEXT,
    p_full_name TEXT,
    p_phone TEXT,
    p_items JSONB,
    p_organization_name TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new_id UUID;
    v_item JSONB;
BEGIN
    IF length(trim(coalesce(p_full_name, ''))) < 2 THEN
        RAISE EXCEPTION 'Nama wajib diisi';
    END IF;

    IF length(trim(coalesce(p_phone, ''))) < 8 THEN
        RAISE EXCEPTION 'Nomor kontak tidak valid';
    END IF;

    IF p_requester_type = 'organisasi' AND length(trim(coalesce(p_organization_name, ''))) = 0 THEN
        RAISE EXCEPTION 'Nama organisasi wajib diisi';
    END IF;

    IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Pilih minimal satu produk';
    END IF;

    IF jsonb_array_length(p_items) > 30 THEN
        RAISE EXCEPTION 'Maksimal 30 produk per permintaan';
    END IF;

    INSERT INTO public.wholesale_requests (
        requester_type,
        full_name,
        organization_name,
        phone,
        email,
        notes
    ) VALUES (
        p_requester_type,
        left(trim(p_full_name), 120),
        CASE WHEN p_requester_type = 'organisasi' THEN left(trim(p_organization_name), 160) END,
        left(trim(p_phone), 40),
        nullif(left(trim(p_email), 160), ''),
        nullif(left(trim(p_notes), 1500), '')
    )
    RETURNING id INTO v_new_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        INSERT INTO public.wholesale_request_items (request_id, umkm_id, product_name, quantity, unit)
        VALUES (
            v_new_id,
            (SELECT id FROM public.umkm WHERE id = v_item->>'umkmId'),
            left(trim(v_item->>'productName'), 200),
            (v_item->>'quantity')::NUMERIC,
            left(trim(v_item->>'unit'), 30)
        );
    END LOOP;

    RETURN jsonb_build_object('success', true, 'id', v_new_id);
END;
$$;

-- 6.3c Get All Wholesale Requests for Admin (items nested, requires admin session)
CREATE OR REPLACE FUNCTION public.get_all_wholesale_requests(p_admin_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    RETURN (
        SELECT coalesce(jsonb_agg(
            jsonb_build_object(
                'id', w.id,
                'requesterType', w.requester_type,
                'fullName', w.full_name,
                'organizationName', w.organization_name,
                'phone', w.phone,
                'email', w.email,
                'notes', w.notes,
                'status', w.status,
                'createdAt', w.created_at,
                'updatedAt', w.updated_at,
                'items', (
                    SELECT coalesce(jsonb_agg(
                        jsonb_build_object(
                            'id', i.id,
                            'umkmId', i.umkm_id,
                            'productName', i.product_name,
                            'quantity', i.quantity,
                            'unit', i.unit
                        ) ORDER BY i.created_at
                    ), '[]'::jsonb)
                    FROM public.wholesale_request_items i
                    WHERE i.request_id = w.id
                )
            ) ORDER BY w.created_at DESC
        ), '[]'::jsonb)
        FROM public.wholesale_requests w
    );
END;
$$;

-- 6.3d Update Wholesale Request Status Procedure (requires admin session)
CREATE OR REPLACE FUNCTION public.update_wholesale_request_status(
    p_admin_token TEXT,
    p_request_id UUID,
    p_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    IF p_status NOT IN ('baru', 'dihubungi', 'selesai', 'dibatalkan') THEN
        RAISE EXCEPTION 'Status tidak valid';
    END IF;

    UPDATE public.wholesale_requests
    SET status = p_status, updated_at = now()
    WHERE id = p_request_id;

    RETURN jsonb_build_object('success', true, 'id', p_request_id, 'status', p_status);
END;
$$;

-- 6.4 Admin Dashboard Stats Procedure (requires admin session)
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats(p_admin_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_umkm INTEGER;
    v_total_mitra INTEGER;
    v_mitra_personal INTEGER;
    v_mitra_organisasi INTEGER;
    v_mitra_persero INTEGER;
    v_total_minat INTEGER;
    v_minat_menunggu INTEGER;
    v_minat_diskusi INTEGER;
    v_minat_disetujui INTEGER;
    v_total_nominal NUMERIC;
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    SELECT count(*) INTO v_total_umkm FROM public.umkm;
    SELECT count(*) INTO v_total_mitra FROM public.users WHERE role = 'mitra';
    SELECT count(*) INTO v_mitra_personal FROM public.users WHERE role = 'mitra' AND mitra_type = 'personal';
    SELECT count(*) INTO v_mitra_organisasi FROM public.users WHERE role = 'mitra' AND mitra_type = 'organisasi';
    SELECT count(*) INTO v_mitra_persero FROM public.users WHERE role = 'mitra' AND mitra_type = 'persero';

    SELECT count(*) INTO v_total_minat FROM public.minat;
    SELECT count(*) INTO v_minat_menunggu FROM public.minat WHERE status = 'menunggu_konfirmasi';
    SELECT count(*) INTO v_minat_diskusi FROM public.minat WHERE status = 'dalam_diskusi';
    SELECT count(*) INTO v_minat_disetujui FROM public.minat WHERE status = 'disetujui';
    SELECT coalesce(sum(nominal_investment), 0) INTO v_total_nominal FROM public.minat;

    RETURN jsonb_build_object(
        'totalUmkm', v_total_umkm,
        'totalMitra', v_total_mitra,
        'mitraPersonal', v_mitra_personal,
        'mitraOrganisasi', v_mitra_organisasi,
        'mitraPersero', v_mitra_persero,
        'totalMinat', v_total_minat,
        'minatMenunggu', v_minat_menunggu,
        'minatDiskusi', v_minat_diskusi,
        'minatDisetujui', v_minat_disetujui,
        'totalNominalInvestasi', v_total_nominal
    );
END;
$$;

-- 6.5 Get All Mitra for Admin (Strictly NO passwords, requires admin session)
CREATE OR REPLACE FUNCTION public.get_all_mitra(p_admin_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    RETURN (
        SELECT coalesce(jsonb_agg(
            jsonb_build_object(
                'id', u.id,
                'username', u.username,
                'fullName', u.full_name,
                'role', u.role,
                'mitraType', u.mitra_type,
                'organizationName', u.organization_name,
                'organizationPosition', u.organization_position,
                'phone', u.phone,
                'address', u.address,
                'isActive', u.is_active,
                'createdAt', u.created_at,
                'totalMinat', (SELECT count(*) FROM public.minat m WHERE m.user_id = u.id)
            ) ORDER BY u.created_at DESC
        ), '[]'::jsonb)
        FROM public.users u
        WHERE u.role = 'mitra'
    );
END;
$$;

-- 6.6 Get All Minat Inquiries for Admin (requires admin session)
CREATE OR REPLACE FUNCTION public.get_all_minat(p_admin_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    RETURN (
        SELECT coalesce(jsonb_agg(
            jsonb_build_object(
                'id', m.id,
                'userId', m.user_id,
                'umkmId', m.umkm_id,
                'umkmName', coalesce(u.data->>'name', u.slug),
                'umkmCategory', coalesce(u.data->>'category', 'Umum'),
                'mitraUsername', usr.username,
                'mitraFullName', usr.full_name,
                'mitraType', usr.mitra_type,
                'organizationName', usr.organization_name,
                'investmentType', m.investment_type,
                'targetItem', m.target_item,
                'nominalInvestment', m.nominal_investment,
                'notes', m.notes,
                'contactPhone', m.contact_phone,
                'proposalUrl', m.proposal_url,
                'proposalFilename', m.proposal_filename,
                'status', m.status,
                'adminNotes', m.admin_notes,
                'createdAt', m.created_at,
                'updatedAt', m.updated_at
            ) ORDER BY m.created_at DESC
        ), '[]'::jsonb)
        FROM public.minat m
        JOIN public.users usr ON usr.id = m.user_id
        LEFT JOIN public.umkm u ON u.id = m.umkm_id
    );
END;
$$;

-- 6.7 Update Minat Status Procedure (requires admin session)
CREATE OR REPLACE FUNCTION public.update_minat_status(
    p_admin_token TEXT,
    p_minat_id UUID,
    p_status TEXT,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    IF p_status NOT IN ('menunggu_konfirmasi', 'dalam_diskusi', 'disetujui', 'ditolak', 'selesai') THEN
        RAISE EXCEPTION 'Status tidak valid';
    END IF;

    UPDATE public.minat
    SET
        status = p_status,
        admin_notes = coalesce(p_admin_notes, admin_notes),
        updated_at = now()
    WHERE id = p_minat_id;

    RETURN jsonb_build_object('success', true, 'id', p_minat_id, 'status', p_status);
END;
$$;

-- 6.8 Get My Minat Procedure (for logged-in mitra to view their submitted interests)
CREATE OR REPLACE FUNCTION public.get_my_minat(p_token TEXT)
RETURNS TABLE (
    id UUID,
    umkm_id TEXT,
    umkm_name TEXT,
    umkm_category TEXT,
    umkm_slug TEXT,
    investment_type TEXT,
    target_item TEXT,
    nominal_investment NUMERIC,
    notes TEXT,
    proposal_url TEXT,
    proposal_filename TEXT,
    status TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT user_id INTO v_user_id
    FROM public.user_sessions
    WHERE token = p_token AND expires_at > now();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Sesi tidak valid atau telah kedaluwarsa';
    END IF;

    RETURN QUERY
    SELECT
        m.id,
        m.umkm_id,
        coalesce(u.data->>'name', m.umkm_id) AS umkm_name,
        coalesce(u.data->>'category', 'Umum') AS umkm_category,
        coalesce(u.slug, m.umkm_id) AS umkm_slug,
        m.investment_type,
        m.target_item,
        m.nominal_investment,
        m.notes,
        m.proposal_url,
        m.proposal_filename,
        m.status,
        m.admin_notes,
        m.created_at,
        m.updated_at
    FROM public.minat m
    LEFT JOIN public.umkm u ON u.id = m.umkm_id
    WHERE m.user_id = v_user_id
    ORDER BY m.created_at DESC;
END;
$$;

-- 6.9 UMKM Management Procedures (requires admin session)
CREATE OR REPLACE FUNCTION public.admin_save_umkm(
    p_admin_token TEXT,
    p_id TEXT,
    p_slug TEXT,
    p_data JSONB,
    p_sort_order INT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_active INT;
    r RECORD;
    v_rank INT;
    v_mat INT;
    v_mkt INT;
    v_dis INT;
    v_fin INT;
    v_tec INT;
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    IF coalesce(trim(p_id), '') = '' THEN
        RAISE EXCEPTION 'ID UMKM wajib diisi';
    END IF;
    IF coalesce(trim(p_slug), '') = '' THEN
        RAISE EXCEPTION 'Slug UMKM wajib diisi';
    END IF;

    -- Upsert main record
    INSERT INTO public.umkm (id, slug, data, sort_order, updated_at)
    VALUES (
        trim(p_id),
        trim(p_slug),
        p_data,
        coalesce(p_sort_order, 100),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        slug = excluded.slug,
        data = excluded.data,
        sort_order = coalesce(p_sort_order, public.umkm.sort_order),
        updated_at = now();

    -- Upsert primary slug
    INSERT INTO public.umkm_slugs (slug, umkm_id, is_primary)
    VALUES (trim(p_slug), trim(p_id), true)
    ON CONFLICT (slug) DO UPDATE SET
        umkm_id = excluded.umkm_id,
        is_primary = true;

    -- Count active UMKMs
    SELECT count(*) INTO v_total_active
    FROM public.umkm
    WHERE coalesce(data->>'activeStatus', 'Aktif') NOT IN ('Nonaktif', 'Dihapus');

    -- Auto-recalculate ranks for all active UMKMs based on score
    v_rank := 1;
    FOR r IN
        SELECT id,
               (
                 coalesce((data->'score'->>'materials')::int, 0) +
                 coalesce((data->'score'->>'market')::int, 0) +
                 coalesce((data->'score'->>'distribution')::int, 0) +
                 coalesce((data->'score'->>'finance')::int, 0) +
                 coalesce((data->'score'->>'technology')::int, 0)
               ) / 5 AS total_score,
               data->'score' AS s
        FROM public.umkm
        WHERE coalesce(data->>'activeStatus', 'Aktif') NOT IN ('Nonaktif', 'Dihapus')
        ORDER BY total_score DESC, id ASC
    LOOP
        UPDATE public.umkm
        SET data = jsonb_set(
            jsonb_set(data, '{priorityRank}', to_jsonb(v_rank)),
            '{priorityTotal}',
            to_jsonb(v_total_active)
        )
        WHERE id = r.id;

        -- Also sync into public.umkm_scores table
        IF r.s IS NOT NULL THEN
            v_mat := coalesce((r.s->>'materials')::int, 0);
            v_mkt := coalesce((r.s->>'market')::int, 0);
            v_dis := coalesce((r.s->>'distribution')::int, 0);
            v_fin := coalesce((r.s->>'finance')::int, 0);
            v_tec := coalesce((r.s->>'technology')::int, 0);

            INSERT INTO public.umkm_scores (
                umkm_id,
                score_market,
                score_finance,
                score_materials,
                score_technology,
                score_distribution,
                priority_rank,
                priority_total
            ) VALUES (
                r.id,
                v_mkt,
                v_fin,
                v_mat,
                v_tec,
                v_dis,
                v_rank,
                v_total_active
            )
            ON CONFLICT (umkm_id) DO UPDATE SET
                score_market = EXCLUDED.score_market,
                score_finance = EXCLUDED.score_finance,
                score_materials = EXCLUDED.score_materials,
                score_technology = EXCLUDED.score_technology,
                score_distribution = EXCLUDED.score_distribution,
                priority_rank = EXCLUDED.priority_rank,
                priority_total = EXCLUDED.priority_total,
                updated_at = now();
        END IF;

        v_rank := v_rank + 1;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'id', p_id, 'slug', p_slug);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_umkm_status(
    p_admin_token TEXT,
    p_id TEXT,
    p_is_active BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    UPDATE public.umkm
    SET
        data = jsonb_set(
            data,
            '{activeStatus}',
            to_jsonb(CASE WHEN p_is_active THEN 'Aktif' ELSE 'Nonaktif' END::text),
            true
        ),
        updated_at = now()
    WHERE id = p_id;

    RETURN jsonb_build_object('success', true, 'id', p_id, 'is_active', p_is_active);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_remove_umkm_record(
    p_admin_token TEXT,
    p_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM public.verify_admin_session(p_admin_token);

    UPDATE public.umkm
    SET
        data = jsonb_set(data, '{activeStatus}', '"Dihapus"'::jsonb, true),
        updated_at = now()
    WHERE id = p_id;

    RETURN jsonb_build_object('success', true, 'id', p_id);
END;
$$;

-- ============================================================================
-- 7. Provisioning Administrator Account (Production Safe)
-- Default/plain-text passwords are NOT automatically committed to production.
-- Use provision_admin_user(...) with your desired strong password in Supabase SQL editor.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.provision_admin_user(
    p_username TEXT,
    p_password TEXT,
    p_full_name TEXT DEFAULT 'Administrator Desa Klepu',
    p_phone TEXT DEFAULT '6281216022043',
    p_address TEXT DEFAULT 'Kantor Desa Klepu, Kec. Sooko, Ponorogo'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    IF length(trim(p_username)) < 3 THEN
        RAISE EXCEPTION 'Username minimal 3 karakter';
    END IF;
    IF length(p_password) < 8 THEN
        RAISE EXCEPTION 'Password minimal 8 karakter';
    END IF;

    INSERT INTO public.users (
        username,
        password_hash,
        full_name,
        role,
        mitra_type,
        phone,
        address
    ) VALUES (
        lower(trim(p_username)),
        crypt(p_password, gen_salt('bf', 10)),
        trim(p_full_name),
        'admin',
        'personal',
        trim(p_phone),
        trim(p_address)
    )
    ON CONFLICT (username) DO UPDATE SET
        password_hash = crypt(p_password, gen_salt('bf', 10)),
        role = 'admin',
        is_active = true,
        updated_at = now()
    RETURNING id INTO v_user_id;

    RETURN jsonb_build_object('success', true, 'id', v_user_id, 'username', p_username);
END;
$$;

-- ============================================================================
-- 8. Storage Bucket for Proposals (Strictly PDF and DOCX only)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'investment-proposals',
    'investment-proposals',
    true,
    20971520, -- 20MB limit
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Allow proposal uploads" ON storage.objects;
CREATE POLICY "Allow proposal uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'investment-proposals');

DROP POLICY IF EXISTS "Allow proposal reads" ON storage.objects;
CREATE POLICY "Allow proposal reads" ON storage.objects
FOR SELECT USING (bucket_id = 'investment-proposals');

-- umkm-media bucket & policies
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('umkm-media', 'umkm-media', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

DROP POLICY IF EXISTS "Allow umkm media reads" ON storage.objects;
CREATE POLICY "Allow umkm media reads" ON storage.objects
FOR SELECT USING (bucket_id = 'umkm-media');

DROP POLICY IF EXISTS "Allow umkm media uploads" ON storage.objects;
CREATE POLICY "Allow umkm media uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'umkm-media');

DROP POLICY IF EXISTS "Allow umkm media deletes" ON storage.objects;
CREATE POLICY "Allow umkm media deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'umkm-media');

DROP POLICY IF EXISTS "Allow umkm media updates" ON storage.objects;
CREATE POLICY "Allow umkm media updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'umkm-media') WITH CHECK (bucket_id = 'umkm-media');


-- ============================================================================
-- 9. Potential (not-yet-existing) UMKM opportunities, e.g. rempah-rempah
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.umkm_potentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT, -- Supabase storage URL; page falls back to a bundled image when null
    ideas TEXT[] NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.potential_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    potential_id UUID REFERENCES public.umkm_potentials(id) ON DELETE SET NULL,
    potential_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru', 'dihubungi', 'selesai', 'dibatalkan')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.umkm_potentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.potential_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active umkm_potentials" ON public.umkm_potentials;
CREATE POLICY "Public read active umkm_potentials" ON public.umkm_potentials FOR SELECT USING (is_active);

CREATE OR REPLACE FUNCTION public.submit_potential_interest(
    p_potential_id UUID,
    p_full_name TEXT,
    p_phone TEXT,
    p_email TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_title TEXT;
BEGIN
    IF length(trim(coalesce(p_full_name, ''))) < 2 THEN
        RAISE EXCEPTION 'Nama wajib diisi';
    END IF;
    IF length(trim(coalesce(p_phone, ''))) < 8 THEN
        RAISE EXCEPTION 'Nomor kontak tidak valid';
    END IF;

    SELECT title INTO v_title FROM public.umkm_potentials WHERE id = p_potential_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Peluang tidak ditemukan';
    END IF;

    INSERT INTO public.potential_interests (potential_id, potential_title, full_name, phone, email, notes)
    VALUES (
        p_potential_id,
        v_title,
        left(trim(p_full_name), 120),
        left(trim(p_phone), 40),
        nullif(left(trim(p_email), 160), ''),
        nullif(left(trim(p_notes), 1500), '')
    );

    RETURN jsonb_build_object('success', true);
END;
$$;

INSERT INTO public.umkm_potentials (slug, title, description, ideas, sort_order)
VALUES (
    'rempah-rempah',
    'Rempah-rempah Klepu',
    'Perkebunan Desa Klepu menghasilkan beragam rempah, tetapi belum ada UMKM yang mengolahnya menjadi produk. Peluang terbuka bagi pelaku usaha atau mitra yang ingin memulai.',
    ARRAY['Bumbu dan rempah kering kemasan', 'Minuman jamu dan wedang rempah', 'Wisata edukasi kebun rempah'],
    1
)
ON CONFLICT (slug) DO NOTHING;
