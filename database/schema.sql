
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

    usia TEXT,
    bidang_studi TEXT,
    riwayat_pelatihan BOOLEAN,
    pengalaman_phishing BOOLEAN,
    penggunaan_mfa BOOLEAN,
    frekuensi_email TEXT,

    p1 SMALLINT, p2 SMALLINT, p3 SMALLINT,
    p4 SMALLINT, p5 SMALLINT, p6 SMALLINT,
    p7 SMALLINT, p8 SMALLINT, p9 SMALLINT,
    p10 SMALLINT, p11 SMALLINT, p12 SMALLINT,

    q1 SMALLINT, q2 SMALLINT, q3 SMALLINT,
    q4 SMALLINT, q5 SMALLINT, q6 SMALLINT,
    q7 SMALLINT, q8 SMALLINT, q9 SMALLINT,
    q10 SMALLINT, q11 SMALLINT, q12 SMALLINT,

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
        REFERENCES public.raw_data(respondent_id),

    p1 SMALLINT NOT NULL CHECK (p1 BETWEEN 1 AND 4),
    p2 SMALLINT NOT NULL CHECK (p2 BETWEEN 1 AND 4),
    p3 SMALLINT NOT NULL CHECK (p3 BETWEEN 1 AND 4),
    p4 SMALLINT NOT NULL CHECK (p4 BETWEEN 1 AND 4),
    p5 SMALLINT NOT NULL CHECK (p5 BETWEEN 1 AND 4),
    p6 SMALLINT NOT NULL CHECK (p6 BETWEEN 1 AND 4),
    p7 SMALLINT NOT NULL CHECK (p7 BETWEEN 1 AND 4),
    p8 SMALLINT NOT NULL CHECK (p8 BETWEEN 1 AND 4),
    p9 SMALLINT NOT NULL CHECK (p9 BETWEEN 1 AND 4),
    p10 SMALLINT NOT NULL CHECK (p10 BETWEEN 1 AND 4),
    p11 SMALLINT NOT NULL CHECK (p11 BETWEEN 1 AND 4),
    p12 SMALLINT NOT NULL CHECK (p12 BETWEEN 1 AND 4),

    confidence_pre JSONB NOT NULL,
    pre_score SMALLINT CHECK (pre_score BETWEEN 0 AND 12),
    accuracy_pre NUMERIC CHECK (accuracy_pre BETWEEN 0 AND 100),
    confidence_pre_avg NUMERIC NOT NULL
        CHECK (confidence_pre_avg BETWEEN 1 AND 5),

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MICROLEARNING PROGRESS
CREATE TABLE IF NOT EXISTS public.microlearning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_id TEXT NOT NULL UNIQUE
        REFERENCES public.raw_data(respondent_id),

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
        REFERENCES public.raw_data(respondent_id),

    q1 SMALLINT NOT NULL,
    q2 SMALLINT NOT NULL,
    q3 SMALLINT NOT NULL,
    q4 SMALLINT NOT NULL,
    q5 SMALLINT NOT NULL,
    q6 SMALLINT NOT NULL,
    q7 SMALLINT NOT NULL,
    q8 SMALLINT NOT NULL,
    q9 SMALLINT NOT NULL,
    q10 SMALLINT NOT NULL,
    q11 SMALLINT NOT NULL,
    q12 SMALLINT NOT NULL,

    post_answers JSONB NOT NULL,
    confidence_post JSONB NOT NULL,
    confidence_post_avg NUMERIC NOT NULL
        CHECK (confidence_post_avg BETWEEN 1 AND 5),

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.raw_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pretest_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microlearning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posttest_responses ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DATABASE SCHEMA COMPLETED
-- =====================================================
