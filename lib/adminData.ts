import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
    POST_CATEGORY,
    POST_KEY,
    PRE_CATEGORY,
    PRE_KEY,
    type Letter,
} from "@/lib/answerKey";
import { analyze } from "@/lib/analysis";
import type { AdminPayload, CleanRow, LogEntry } from "@/lib/adminTypes";

type DbRow = Record<string, unknown>;

const LETTERS: Letter[] = ["A", "B", "C", "D"];

function num(value: unknown): number | null {
    const parsed =
        typeof value === "number"
            ? value
            : typeof value === "string" && value.trim() !== ""
                ? Number(value)
                : NaN;

    return Number.isFinite(parsed) ? parsed : null;
}

function text(value: unknown): string | null {
    if (value === null || value === undefined) return null;

    return String(value);
}

function bool(value: unknown): boolean | null {
    return typeof value === "boolean" ? value : null;
}

function confidenceAverage(avg: unknown, detail: unknown): number | null {
    const stored = num(avg);

    if (stored !== null) return stored;

    if (detail && typeof detail === "object") {
        const values = Object.values(detail as Record<string, unknown>)
            .map(num)
            .filter((v): v is number => v !== null);

        if (values.length > 0) {
            return values.reduce((sum, v) => sum + v, 0) / values.length;
        }
    }

    return null;
}

function scoreItems(
    source: DbRow | undefined,
    prefix: "p" | "q",
    key: (Letter | null)[]
): (number | null)[] {
    return Array.from({ length: 12 }, (_, i) => {
        const expected = key[i];

        if (!source || expected === null) return null;

        const value = num(source[`${prefix}${i + 1}`]);

        if (value === null || value < 1 || value > 4) return null;

        return LETTERS[value - 1] === expected ? 1 : 0;
    });
}

function sumItems(items: (number | null)[]) {
    if (items.some((item) => item === null)) return null;

    return (items as number[]).reduce((sum, item) => sum + item, 0);
}

function flatten(
    source: DbRow | undefined,
    prefix: "p" | "q",
    detailKey: string,
    avgKey: string
): DbRow {
    const result: DbRow = {};

    for (let i = 1; i <= 12; i++) {
        result[`${prefix}${i}`] = source ? (source[`${prefix}${i}`] ?? null) : null;
    }

    result[detailKey] = source ? (source[detailKey] ?? null) : null;
    result[avgKey] = source ? (source[avgKey] ?? null) : null;

    return result;
}

export async function buildAdminPayload(): Promise<AdminPayload> {
    const [raw, pre, post, progress, logResult] = await Promise.all([
        supabaseAdmin.from("raw_data").select("*").range(0, 4999),
        supabaseAdmin.from("pretest_responses").select("*").range(0, 4999),
        supabaseAdmin.from("posttest_responses").select("*").range(0, 4999),
        supabaseAdmin.from("microlearning_progress").select("*").range(0, 4999),
        supabaseAdmin
            .from("cleaning_log")
            .select("*")
            .order("id", { ascending: true })
            .range(0, 4999),
    ]);

    const failed = [raw, pre, post, progress, logResult].find(
        (result) => result.error
    );

    if (failed?.error) {
        throw new Error(failed.error.message);
    }

    const preMap = new Map<string, DbRow>();
    const postMap = new Map<string, DbRow>();
    const progressMap = new Map<string, DbRow>();

    (pre.data ?? []).forEach((row: DbRow) =>
        preMap.set(String(row.respondent_id), row)
    );
    (post.data ?? []).forEach((row: DbRow) =>
        postMap.set(String(row.respondent_id), row)
    );
    (progress.data ?? []).forEach((row: DbRow) =>
        progressMap.set(String(row.respondent_id), row)
    );

    const log = (logResult.data ?? []) as LogEntry[];
    const latestAction = new Map<string, LogEntry>();

    log.forEach((entry) => latestAction.set(entry.respondent_id, entry));

    const keyReady =
        PRE_KEY.every((k) => k !== null) && POST_KEY.every((k) => k !== null);

    const rows: CleanRow[] = [];
    const rawRows: DbRow[] = [];

    ((raw.data ?? []) as DbRow[]).forEach((row) => {
        const id = String(row.respondent_id);
        const preRow = preMap.get(id);
        const postRow = postMap.get(id);
        const progressRow = progressMap.get(id);

        const itemsPre = scoreItems(preRow, "p", PRE_KEY);
        const itemsPost = scoreItems(postRow, "q", POST_KEY);
        const preScore = sumItems(itemsPre);
        const postScore = sumItems(itemsPost);

        const duration =
            num(row.total_treatment_seconds) ??
            num(progressRow?.total_seconds) ??
            null;

        const reasons: string[] = [];
        const warnings: string[] = [];

        if (!preRow) reasons.push("Pre-test tidak ada");
        if (!postRow) reasons.push("Post-test tidak ada");

        if (keyReady) {
            if (preRow && preScore === null) {
                reasons.push("Jawaban pre-test tidak lengkap");
            }

            if (postRow && postScore === null) {
                reasons.push("Jawaban post-test tidak lengkap");
            }
        }

        if (preRow && (num(progressRow?.current_unit) ?? 0) < 7) {
            reasons.push("Microlearning belum selesai");
        }

        const last = latestAction.get(id);
        const manualExcluded = last?.action === "exclude";

        if (manualExcluded && last) {
            reasons.push(`Manual: ${last.reason}`);
        }

        if (duration !== null && (duration < 300 || duration > 420)) {
            warnings.push(
                `Durasi treatment ${Math.round(duration)} detik (di luar 5–7 menit)`
            );
        }

        if (text(row.group_id) !== "A03") {
            warnings.push("group_id bukan A03");
        }

        rows.push({
            respondent_id: id,
            group_id: text(row.group_id),
            treatment: text(row.treatment),
            usia: text(row.usia),
            bidang_studi: text(row.bidang_studi),
            riwayat_pelatihan: bool(row.riwayat_pelatihan),
            pengalaman_phishing: bool(row.pengalaman_phishing),
            penggunaan_mfa: bool(row.penggunaan_mfa),
            frekuensi_email: text(row.frekuensi_email),
            total_treatment_seconds: duration,
            has_pre: Boolean(preRow),
            has_post: Boolean(postRow),
            items_pre: itemsPre,
            items_post: itemsPost,
            pre_score: preScore,
            post_score: postScore,
            accuracy_pre: preScore === null ? null : (preScore / 12) * 100,
            accuracy_post: postScore === null ? null : (postScore / 12) * 100,
            confidence_pre: confidenceAverage(
                preRow?.confidence_pre_avg,
                preRow?.confidence_pre
            ),
            confidence_post: confidenceAverage(
                postRow?.confidence_post_avg,
                postRow?.confidence_post
            ),
            improvement:
                preScore !== null && postScore !== null
                    ? postScore - preScore
                    : null,
            valid_case: reasons.length === 0,
            exclusion_reason: reasons.join("; "),
            manual_excluded: manualExcluded,
            warnings,
        });

        rawRows.push({
            ...row,
            ...flatten(preRow, "p", "confidence_pre", "confidence_pre_avg"),
            ...flatten(postRow, "q", "confidence_post", "confidence_post_avg"),
        });
    });

    const validRows = rows.filter((row) => row.valid_case);

    return {
        generatedAt: new Date().toISOString(),
        keyReady,
        rows,
        rawRows,
        log,
        analysis: keyReady
            ? analyze(validRows, PRE_CATEGORY, POST_CATEGORY)
            : null,
    };
}