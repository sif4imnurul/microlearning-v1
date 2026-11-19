export type Desc = {
    n: number;
    mean: number | null;
    median: number | null;
    sd: number | null;
    min: number | null;
    max: number | null;
};

export type PairedT = {
    n: number;
    meanDiff: number;
    sdDiff: number;
    t: number;
    df: number;
    p: number;
    ciLow: number;
    ciHigh: number;
    dz: number;
};

export type Wilcoxon = {
    n: number;
    wPlus: number;
    wMinus: number;
    z: number;
    p: number;
    r: number;
};

export type ItemStat = {
    label: string;
    category: string;
    correctRate: number | null;
};

export type CategoryStat = {
    category: string;
    preCorrectRate: number | null;
    postCorrectRate: number | null;
};

export type Analysis = {
    n: number;
    pre: Desc;
    post: Desc;
    accuracyPre: Desc;
    accuracyPost: Desc;
    improvement: Desc;
    confidencePre: Desc;
    confidencePost: Desc;
    pairedT: PairedT | null;
    wilcoxon: Wilcoxon | null;
    improvedCount: number;
    sameCount: number;
    declinedCount: number;
    itemsPre: ItemStat[];
    itemsPost: ItemStat[];
    categories: CategoryStat[];
};

export type CleanRow = {
    respondent_id: string;
    group_id: string | null;
    treatment: string | null;
    usia: string | null;
    bidang_studi: string | null;
    riwayat_pelatihan: boolean | null;
    pengalaman_phishing: boolean | null;
    penggunaan_mfa: boolean | null;
    frekuensi_email: string | null;
    total_treatment_seconds: number | null;
    has_pre: boolean;
    has_post: boolean;
    items_pre: (number | null)[];
    items_post: (number | null)[];
    pre_score: number | null;
    post_score: number | null;
    accuracy_pre: number | null;
    accuracy_post: number | null;
    confidence_pre: number | null;
    confidence_post: number | null;
    improvement: number | null;
    valid_case: boolean;
    exclusion_reason: string;
    manual_excluded: boolean;
    warnings: string[];
};

export type LogEntry = {
    id: number;
    respondent_id: string;
    action: string;
    reason: string;
    created_at: string;
};

export type AdminPayload = {
    generatedAt: string;
    keyReady: boolean;
    rows: CleanRow[];
    rawRows: Record<string, unknown>[];
    log: LogEntry[];
    analysis: Analysis | null;
};