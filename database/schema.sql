
-- =====================================================
-- MICROLEARNING A03 DATABASE SCHEMA
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. RAW DATA
CREATE TABLE IF NOT EXISTS public.raw_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_id TEXT NOT NULL UNIQUE,
    group_id TEXT NOT NULL DEFAULT 'A03',
    treatment TEXT NOT NULL DEFAULT 'Microlearning',
    session_type TEXT NOT NULL DEFAULT 'pilot'
        CHECK (session_type IN ('pilot', 'experiment')),
    is_completed BOOLEAN DEFAULT FALSE,

    usia TEXT,
    bidang_studi TEXT,
    riwayat_pelatihan BOOLEAN,
    pengalaman_phishing BOOLEAN,
    penggunaan_mfa BOOLEAN,
    frekuensi_email TEXT,

    p1 TEXT, p2 TEXT, p3 TEXT,
    p4 TEXT, p5 TEXT, p6 TEXT,
    p7 TEXT, p8 TEXT, p9 TEXT,
    p10 TEXT, p11 TEXT, p12 TEXT,

    q1 TEXT, q2 TEXT, q3 TEXT,
    q4 TEXT, q5 TEXT, q6 TEXT,
    q7 TEXT, q8 TEXT, q9 TEXT,
    q10 TEXT, q11 TEXT, q12 TEXT,

    pre_answers JSONB,
    post_answers JSONB,
    confidence_pre JSONB,
    confidence_post JSONB,

    pre_score SMALLINT CHECK (
        pre_score IS NULL OR pre_score BETWEEN 0 AND 12
    ),
    post_score SMALLINT CHECK (
        post_score IS NULL OR post_score BETWEEN 0 AND 12
    ),

    accuracy_pre NUMERIC,
    accuracy_post NUMERIC,
    improvement SMALLINT,
    confidence_pre_avg NUMERIC,
    confidence_post_avg NUMERIC,

    valid_case BOOLEAN DEFAULT TRUE,
    exclusion_reason TEXT,
    technical_notes TEXT,

    feedback TEXT,
    feedback_submitted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    u1_seconds INTEGER DEFAULT 0,
    u2_seconds INTEGER DEFAULT 0,
    u3_seconds INTEGER DEFAULT 0,
    u4_seconds INTEGER DEFAULT 0,
    u5_seconds INTEGER DEFAULT 0,
    u6_seconds INTEGER DEFAULT 0,
    total_treatment_seconds INTEGER DEFAULT 0
);

-- 2. PRETEST RESPONSES
CREATE TABLE IF NOT EXISTS public.pretest_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_id TEXT NOT NULL UNIQUE
        REFERENCES public.raw_data(respondent_id) ON DELETE CASCADE,

    p1 TEXT NOT NULL CHECK (p1 IN ('A', 'B', 'C', 'D')),
    p2 TEXT NOT NULL CHECK (p2 IN ('A', 'B', 'C', 'D')),
    p3 TEXT NOT NULL CHECK (p3 IN ('A', 'B', 'C', 'D')),
    p4 TEXT NOT NULL CHECK (p4 IN ('A', 'B', 'C', 'D')),
    p5 TEXT NOT NULL CHECK (p5 IN ('A', 'B', 'C', 'D')),
    p6 TEXT NOT NULL CHECK (p6 IN ('A', 'B', 'C', 'D')),
    p7 TEXT NOT NULL CHECK (p7 IN ('A', 'B', 'C', 'D')),
    p8 TEXT NOT NULL CHECK (p8 IN ('A', 'B', 'C', 'D')),
    p9 TEXT NOT NULL CHECK (p9 IN ('A', 'B', 'C', 'D')),
    p10 TEXT NOT NULL CHECK (p10 IN ('A', 'B', 'C', 'D')),
    p11 TEXT NOT NULL CHECK (p11 IN ('A', 'B', 'C', 'D')),
    p12 TEXT NOT NULL CHECK (p12 IN ('A', 'B', 'C', 'D')),

    confidence_pre JSONB NOT NULL,
    pre_score SMALLINT CHECK (pre_score IS NULL OR pre_score BETWEEN 0 AND 12),
    accuracy_pre NUMERIC CHECK (accuracy_pre IS NULL OR accuracy_pre BETWEEN 0 AND 100),
    confidence_pre_avg NUMERIC NOT NULL
        CHECK (confidence_pre_avg BETWEEN 1 AND 5),

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MICROLEARNING PROGRESS
CREATE TABLE IF NOT EXISTS public.microlearning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_id TEXT NOT NULL UNIQUE
        REFERENCES public.raw_data(respondent_id) ON DELETE CASCADE,

    current_unit SMALLINT NOT NULL DEFAULT 1
        CHECK (current_unit BETWEEN 1 AND 7),

    completed_units JSONB NOT NULL DEFAULT '[]'::JSONB,

    u1_seconds INTEGER NOT NULL DEFAULT 0,
    u2_seconds INTEGER NOT NULL DEFAULT 0,
    u3_seconds INTEGER NOT NULL DEFAULT 0,
    u4_seconds INTEGER NOT NULL DEFAULT 0,
    u5_seconds INTEGER NOT NULL DEFAULT 0,
    u6_seconds INTEGER NOT NULL DEFAULT 0,

    total_seconds INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. POSTTEST RESPONSES
CREATE TABLE IF NOT EXISTS public.posttest_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_id TEXT NOT NULL UNIQUE
        REFERENCES public.raw_data(respondent_id) ON DELETE CASCADE,

    q1 TEXT NOT NULL CHECK (q1 IN ('A', 'B', 'C', 'D')),
    q2 TEXT NOT NULL CHECK (q2 IN ('A', 'B', 'C', 'D')),
    q3 TEXT NOT NULL CHECK (q3 IN ('A', 'B', 'C', 'D')),
    q4 TEXT NOT NULL CHECK (q4 IN ('A', 'B', 'C', 'D')),
    q5 TEXT NOT NULL CHECK (q5 IN ('A', 'B', 'C', 'D')),
    q6 TEXT NOT NULL CHECK (q6 IN ('A', 'B', 'C', 'D')),
    q7 TEXT NOT NULL CHECK (q7 IN ('A', 'B', 'C', 'D')),
    q8 TEXT NOT NULL CHECK (q8 IN ('A', 'B', 'C', 'D')),
    q9 TEXT NOT NULL CHECK (q9 IN ('A', 'B', 'C', 'D')),
    q10 TEXT NOT NULL CHECK (q10 IN ('A', 'B', 'C', 'D')),
    q11 TEXT NOT NULL CHECK (q11 IN ('A', 'B', 'C', 'D')),
    q12 TEXT NOT NULL CHECK (q12 IN ('A', 'B', 'C', 'D')),

    post_answers JSONB,
    confidence_post JSONB NOT NULL,
    confidence_post_avg NUMERIC NOT NULL
        CHECK (confidence_post_avg BETWEEN 1 AND 5),

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. APP SETTINGS
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.raw_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pretest_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microlearning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posttest_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DATABASE SCHEMA COMPLETED
-- =====================================================
