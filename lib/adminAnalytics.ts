export type OptionLetter = "A" | "B" | "C" | "D";

// ============================================================================
// KUNCI JAWABAN INSTRUMEN
// ============================================================================
export const PRETEST_ANSWER_KEY: Record<string, OptionLetter> = {
    P1: "B",
    P2: "B",
    P3: "C",
    P4: "C",
    P5: "B",
    P6: "B",
    P7: "B",
    P8: "B",
    P9: "A",
    P10: "C",
    P11: "B",
    P12: "A",
};

export const POSTTEST_ANSWER_KEY: Record<string, OptionLetter> = {
    Q1: "B",
    Q2: "B",
    Q3: "B",
    Q4: "B",
    Q5: "B",
    Q6: "A",
    Q7: "B",
    Q8: "B",
    Q9: "B",
    Q10: "B",
    Q11: "B",
    Q12: "A",
};

// Batas minimal total durasi baca microlearning (detik) agar lolos Clean Data
export const MIN_VALID_TREATMENT_SECONDS = 30;

export interface RawRespondentRow {
    respondent_id: string;
    group_id: string;
    treatment: string;
    session_type: "pilot" | "experiment";
    created_at_wib: string;
    is_completed: boolean;
    // Demografi (D1 - D6)
    D1_usia: string;
    D2_bidang_studi: string;
    D3_riwayat_pelatihan: string;
    D4_pengalaman_phishing: string;
    D5_penggunaan_mfa: string;
    D6_frekuensi_email: string;
    // Pre-test (P1 - P12)
    pre_answers: Record<string, string>;
    pre_confidence: Record<string, number>;
    confidence_pre_avg: number | null;
    pre_score: number | null;
    pre_accuracy: number | null;
    has_pretest: boolean;
    // Microlearning (U1 - U6)
    u1_seconds: number | null;
    u2_seconds: number | null;
    u3_seconds: number | null;
    u4_seconds: number | null;
    u5_seconds: number | null;
    u6_seconds: number | null;
    total_treatment_seconds: number;
    completed_units_count: number;
    // Post-test (Q1 - Q12)
    post_answers: Record<string, string>;
    post_confidence: Record<string, number>;
    confidence_post_avg: number | null;
    post_score: number | null;
    post_accuracy: number | null;
    has_posttest: boolean;
    // Feedback
    feedback: string;
    feedback_submitted_at_wib: string;
}

export interface CleanRespondentRow extends RawRespondentRow {
    pre_score_final: number;
    post_score_final: number;
    pre_accuracy_pct: number;
    post_accuracy_pct: number;
    score_gain: number;
    n_gain: number;
    n_gain_category: "Tinggi" | "Sedang" | "Rendah";
    confidence_gain: number;
}

export interface ExclusionLogItem {
    respondent_id: string;
    session_type: "pilot" | "experiment";
    created_at_wib: string;
    reasons: string[];
    total_treatment_seconds: number;
    has_pretest: boolean;
    completed_units_count: number;
    has_posttest: boolean;
}

export interface ItemComparison {
    itemNumber: number;
    preCode: string;
    postCode: string;
    preCorrectCount: number;
    postCorrectCount: number;
    preAccuracyPct: number;
    postAccuracyPct: number;
    deltaPct: number;
}

export interface StatisticalSummary {
    totalRaw: number;
    totalClean: number;
    totalExcluded: number;
    preMean: number;
    preSD: number;
    preMedian: number;
    postMean: number;
    postSD: number;
    postMedian: number;
    gainMean: number;
    nGainMean: number;
    nGainDistribution: {
        tinggi: number;
        sedang: number;
        rendah: number;
    };
    tStatistic: number;
    degreesOfFreedom: number;
    pValueApprox: number;
    isSignificant: boolean;
    cohensD: number;
    avgTreatmentSeconds: number;
    preConfidenceMean: number;
    postConfidenceMean: number;
    itemComparisons: ItemComparison[];
}

export function formatWIB(dateValue: string | Date | null | undefined): string {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return String(dateValue);

    const formatted = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);

    return `${formatted} WIB`;
}

export function calculateScore(
    answers: Record<string, string>,
    keyMap: Record<string, OptionLetter>,
    prefix: "P" | "Q"
): number {
    let correct = 0;
    for (let i = 1; i <= 12; i++) {
        const code = `${prefix}${i}`;
        const ans = (answers[code] || "").trim().toUpperCase();
        if (ans && ans === keyMap[code]) {
            correct++;
        }
    }
    return correct;
}

function isStraightLining(answers: Record<string, string>, prefix: "P" | "Q"): boolean {
    const vals: string[] = [];
    for (let i = 1; i <= 12; i++) {
        const v = (answers[`${prefix}${i}`] || "").trim().toUpperCase();
        if (!v) return false;
        vals.push(v);
    }
    return new Set(vals).size === 1;
}

export function processCleaningAndStats(rawRows: RawRespondentRow[]): {
    cleanRows: CleanRespondentRow[];
    exclusionLogs: ExclusionLogItem[];
    stats: StatisticalSummary;
} {
    const cleanRows: CleanRespondentRow[] = [];
    const exclusionLogs: ExclusionLogItem[] = [];

    for (const row of rawRows) {
        const reasons: string[] = [];

        if (!row.has_pretest) {
            reasons.push("Pre-test belum dikerjakan");
        }
        if (row.completed_units_count < 6) {
            reasons.push(`Unit Microlearning tidak lengkap (${row.completed_units_count}/6)`);
        }
        if (!row.has_posttest) {
            reasons.push("Post-test belum dikerjakan");
        }
        if (
            row.has_pretest &&
            row.has_posttest &&
            row.total_treatment_seconds < MIN_VALID_TREATMENT_SECONDS
        ) {
            reasons.push(
                `Durasi total treatment terlalu singkat (${row.total_treatment_seconds} detik < ${MIN_VALID_TREATMENT_SECONDS} detik)`
            );
        }
        if (
            row.has_pretest &&
            row.has_posttest &&
            isStraightLining(row.pre_answers, "P") &&
            isStraightLining(row.post_answers, "Q")
        ) {
            reasons.push("Pola jawaban identik di seluruh 24 soal (straight-lining)");
        }

        if (reasons.length > 0) {
            exclusionLogs.push({
                respondent_id: row.respondent_id,
                session_type: row.session_type,
                created_at_wib: row.created_at_wib,
                reasons,
                total_treatment_seconds: row.total_treatment_seconds,
                has_pretest: row.has_pretest,
                completed_units_count: row.completed_units_count,
                has_posttest: row.has_posttest,
            });
            continue;
        }

        const preScore = calculateScore(row.pre_answers, PRETEST_ANSWER_KEY, "P");
        const postScore = calculateScore(row.post_answers, POSTTEST_ANSWER_KEY, "Q");
        const preAcc = Number(((preScore / 12) * 100).toFixed(2));
        const postAcc = Number(((postScore / 12) * 100).toFixed(2));
        const scoreGain = postScore - preScore;

        // Rumus Hake Normalized Gain <g>
        let nGain = 0;
        if (preScore < 12) {
            nGain = (postScore - preScore) / (12 - preScore);
        } else if (postScore === 12) {
            nGain = 0;
        }
        const nGainRounded = Number(nGain.toFixed(4));

        let nGainCategory: "Tinggi" | "Sedang" | "Rendah" = "Rendah";
        if (nGainRounded >= 0.7) nGainCategory = "Tinggi";
        else if (nGainRounded >= 0.3) nGainCategory = "Sedang";

        const confGain =
            row.confidence_post_avg !== null && row.confidence_pre_avg !== null
                ? Number((row.confidence_post_avg - row.confidence_pre_avg).toFixed(2))
                : 0;

        cleanRows.push({
            ...row,
            pre_score_final: preScore,
            post_score_final: postScore,
            pre_accuracy_pct: preAcc,
            post_accuracy_pct: postAcc,
            score_gain: scoreGain,
            n_gain: nGainRounded,
            n_gain_category: nGainCategory,
            confidence_gain: confGain,
        });
    }

    const stats = computeStatistics(rawRows.length, cleanRows, exclusionLogs.length);
    return { cleanRows, exclusionLogs, stats };
}

function mean(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr: number[]): number {
    if (arr.length < 2) return 0;
    const m = mean(arr);
    const variance = arr.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
}

function median(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Aproksimasi p-value dua arah dari distribusi Student's t
function twoTailedPValueFromT(t: number, df: number): number {
    if (df <= 0 || !Number.isFinite(t)) return 1;
    const absT = Math.abs(t);
    const x = df / (df + absT * absT);
    const beta = regularizedIncompleteBeta(x, df / 2, 0.5);
    return Math.min(1, Math.max(0, beta));
}

function regularizedIncompleteBeta(x: number, a: number, b: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(
        logGamma(a + b) -
        logGamma(a) -
        logGamma(b) +
        a * Math.log(x) +
        b * Math.log(1 - x)
    );
    if (x < (a + 1) / (a + b + 2)) {
        return (bt * betacf(x, a, b)) / a;
    }
    return 1 - (bt * betacf(1 - x, b, a)) / b;
}

function betacf(x: number, a: number, b: number): number {
    const MAXIT = 100;
    const EPS = 3e-7;
    const FPMIN = 1e-30;
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - (qab * x) / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= MAXIT; m++) {
        const m2 = 2 * m;
        let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < FPMIN) d = FPMIN;
        c = 1 + aa / c;
        if (Math.abs(c) < FPMIN) c = FPMIN;
        d = 1 / d;
        h *= d * c;
        aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < FPMIN) d = FPMIN;
        c = 1 + aa / c;
        if (Math.abs(c) < FPMIN) c = FPMIN;
        d = 1 / d;
        const del = d * c;
        h *= del;
        if (Math.abs(del - 1) < EPS) break;
    }
    return h;
}

function logGamma(z: number): number {
    const cof = [
        76.18009172947146, -86.50532032941677, 24.01409824083091,
        -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5,
    ];
    let x = z;
    let y = z;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j <= 5; j++) {
        ser += cof[j] / ++y;
    }
    return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

function computeStatistics(
    totalRaw: number,
    cleanRows: CleanRespondentRow[],
    totalExcluded: number
): StatisticalSummary {
    const n = cleanRows.length;
    const preScores = cleanRows.map((r) => r.pre_score_final);
    const postScores = cleanRows.map((r) => r.post_score_final);
    const gains = cleanRows.map((r) => r.score_gain);
    const nGains = cleanRows.map((r) => r.n_gain);
    const durations = cleanRows.map((r) => r.total_treatment_seconds);
    const preConfs = cleanRows
        .map((r) => r.confidence_pre_avg)
        .filter((v): v is number => v !== null);
    const postConfs = cleanRows
        .map((r) => r.confidence_post_avg)
        .filter((v): v is number => v !== null);

    const gainMean = mean(gains);
    const gainSD = stdDev(gains);
    const df = n > 1 ? n - 1 : 0;
    const tStat = n > 1 && gainSD > 0 ? gainMean / (gainSD / Math.sqrt(n)) : 0;
    const pVal = n > 1 ? twoTailedPValueFromT(tStat, df) : 1;
    const cohensD = n > 1 && gainSD > 0 ? gainMean / gainSD : 0;

    const itemComparisons: ItemComparison[] = [];
    for (let i = 1; i <= 12; i++) {
        const preCode = `P${i}`;
        const postCode = `Q${i}`;
        let preCorrect = 0;
        let postCorrect = 0;

        for (const r of cleanRows) {
            if ((r.pre_answers[preCode] || "").toUpperCase() === PRETEST_ANSWER_KEY[preCode]) {
                preCorrect++;
            }
            if ((r.post_answers[postCode] || "").toUpperCase() === POSTTEST_ANSWER_KEY[postCode]) {
                postCorrect++;
            }
        }

        const prePct = n > 0 ? Number(((preCorrect / n) * 100).toFixed(1)) : 0;
        const postPct = n > 0 ? Number(((postCorrect / n) * 100).toFixed(1)) : 0;

        itemComparisons.push({
            itemNumber: i,
            preCode,
            postCode,
            preCorrectCount: preCorrect,
            postCorrectCount: postCorrect,
            preAccuracyPct: prePct,
            postAccuracyPct: postPct,
            deltaPct: Number((postPct - prePct).toFixed(1)),
        });
    }

    return {
        totalRaw,
        totalClean: n,
        totalExcluded,
        preMean: Number(mean(preScores).toFixed(2)),
        preSD: Number(stdDev(preScores).toFixed(2)),
        preMedian: Number(median(preScores).toFixed(2)),
        postMean: Number(mean(postScores).toFixed(2)),
        postSD: Number(stdDev(postScores).toFixed(2)),
        postMedian: Number(median(postScores).toFixed(2)),
        gainMean: Number(gainMean.toFixed(2)),
        nGainMean: Number(mean(nGains).toFixed(3)),
        nGainDistribution: {
            tinggi: cleanRows.filter((r) => r.n_gain_category === "Tinggi").length,
            sedang: cleanRows.filter((r) => r.n_gain_category === "Sedang").length,
            rendah: cleanRows.filter((r) => r.n_gain_category === "Rendah").length,
        },
        tStatistic: Number(tStat.toFixed(3)),
        degreesOfFreedom: df,
        pValueApprox: Number(pVal.toFixed(4)),
        isSignificant: n > 1 && pVal < 0.05,
        cohensD: Number(cohensD.toFixed(3)),
        avgTreatmentSeconds: Number(mean(durations).toFixed(1)),
        preConfidenceMean: Number(mean(preConfs).toFixed(2)),
        postConfidenceMean: Number(mean(postConfs).toFixed(2)),
        itemComparisons,
    };
}

export function downloadCSV(
    filename: string,
    headers: string[],
    rows: Array<Array<string | number | boolean | null | undefined>>
): void {
    const DELIMITER = ";";

    const escapeCell = (val: string | number | boolean | null | undefined): string => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (
            str.includes(DELIMITER) ||
            str.includes(",") ||
            str.includes('"') ||
            str.includes("\n") ||
            str.includes("\r")
        ) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const csvLines = [
        `sep=${DELIMITER}`,
        headers.map(escapeCell).join(DELIMITER),
        ...rows.map((row) => row.map(escapeCell).join(DELIMITER)),
    ];

    // BOM UTF-8 agar karakter Indonesia & format Excel terbaca rapi per kolom
    const blob = new Blob(["\uFEFF" + csvLines.join("\r\n")], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}