import { NextResponse, connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
    formatWIB,
    calculateScore,
    PRETEST_ANSWER_KEY,
    POSTTEST_ANSWER_KEY,
    processCleaningAndStats,
    type RawRespondentRow,
} from "@/lib/adminAnalytics";

function isAuthorized(request: Request): boolean {
    const validPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY;
    if (!validPassword) return false;

    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const provided =
        request.headers.get("x-admin-password") ||
        request.headers.get("x-admin-key") ||
        bearer;

    return provided === validPassword;
}

function formatBool(val: unknown): string {
    if (typeof val === "boolean") return val ? "Ya" : "Tidak";
    return val ? String(val) : "";
}

export async function GET(request: Request) {
    try {
        await connection();

        if (!isAuthorized(request)) {
            return NextResponse.json(
                { success: false, message: "Password admin tidak valid." },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const sessionFilter = searchParams.get("session") || "all";

        let rawQuery = supabaseAdmin
            .from("raw_data")
            .select("*")
            .order("created_at", { ascending: false });

        if (sessionFilter === "pilot" || sessionFilter === "experiment") {
            rawQuery = rawQuery.eq("session_type", sessionFilter);
        }

        const [rawRes, preRes, mlRes, postRes] = await Promise.all([
            rawQuery,
            supabaseAdmin.from("pretest_responses").select("*"),
            supabaseAdmin.from("microlearning_progress").select("*"),
            supabaseAdmin.from("posttest_responses").select("*"),
        ]);

        if (rawRes.error) throw rawRes.error;
        if (preRes.error) throw preRes.error;
        if (mlRes.error) throw mlRes.error;
        if (postRes.error) throw postRes.error;

        const preMap = new Map(
            (preRes.data || []).map((item) => [item.respondent_id, item])
        );
        const mlMap = new Map(
            (mlRes.data || []).map((item) => [item.respondent_id, item])
        );
        const postMap = new Map(
            (postRes.data || []).map((item) => [item.respondent_id, item])
        );

        const rawRows: RawRespondentRow[] = (rawRes.data || []).map((raw) => {
            const pre = preMap.get(raw.respondent_id);
            const ml = mlMap.get(raw.respondent_id);
            const post = postMap.get(raw.respondent_id);

            const preAnswers: Record<string, string> = {};
            const postAnswers: Record<string, string> = {};

            for (let i = 1; i <= 12; i++) {
                preAnswers[`P${i}`] = pre?.[`p${i}`] ? String(pre[`p${i}`]) : "";
                postAnswers[`Q${i}`] = post?.[`q${i}`] ? String(post[`q${i}`]) : "";
            }

            const completedUnitsCount = Array.isArray(ml?.completed_units)
                ? ml.completed_units.length
                : 0;

            const preScoreCalc = pre
                ? calculateScore(preAnswers, PRETEST_ANSWER_KEY, "P")
                : null;
            const postScoreCalc = post
                ? calculateScore(postAnswers, POSTTEST_ANSWER_KEY, "Q")
                : null;

            return {
                respondent_id: raw.respondent_id,
                group_id: raw.group_id || "A03",
                treatment: raw.treatment || "Microlearning",
                session_type: raw.session_type === "experiment" ? "experiment" : "pilot",
                created_at_wib: formatWIB(raw.created_at),
                is_completed: Boolean(raw.is_completed),
                D1_usia: String(raw.usia ?? ""),
                D2_bidang_studi: String(raw.bidang_studi ?? ""),
                D3_riwayat_pelatihan: formatBool(raw.riwayat_pelatihan),
                D4_pengalaman_phishing: formatBool(raw.pengalaman_phishing),
                D5_penggunaan_mfa: formatBool(raw.penggunaan_mfa),
                D6_frekuensi_email: String(raw.frekuensi_email ?? ""),
                pre_answers: preAnswers,
                pre_confidence: (pre?.confidence_pre as Record<string, number>) || {},
                confidence_pre_avg:
                    pre?.confidence_pre_avg !== undefined && pre?.confidence_pre_avg !== null
                        ? Number(pre.confidence_pre_avg)
                        : null,
                pre_score: preScoreCalc,
                pre_accuracy:
                    preScoreCalc !== null
                        ? Number(((preScoreCalc / 12) * 100).toFixed(2))
                        : null,
                has_pretest: Boolean(pre),
                u1_seconds: ml?.u1_seconds ?? null,
                u2_seconds: ml?.u2_seconds ?? null,
                u3_seconds: ml?.u3_seconds ?? null,
                u4_seconds: ml?.u4_seconds ?? null,
                u5_seconds: ml?.u5_seconds ?? null,
                u6_seconds: ml?.u6_seconds ?? null,
                total_treatment_seconds: Number(ml?.total_seconds ?? 0),
                completed_units_count: completedUnitsCount,
                post_answers: postAnswers,
                post_confidence: (post?.confidence_post as Record<string, number>) || {},
                confidence_post_avg:
                    post?.confidence_post_avg !== undefined && post?.confidence_post_avg !== null
                        ? Number(post.confidence_post_avg)
                        : null,
                post_score: postScoreCalc,
                post_accuracy:
                    postScoreCalc !== null
                        ? Number(((postScoreCalc / 12) * 100).toFixed(2))
                        : null,
                has_posttest: Boolean(post),
                feedback: String(raw.feedback ?? ""),
                feedback_submitted_at_wib: formatWIB(raw.feedback_submitted_at),
            };
        });

        const { cleanRows, exclusionLogs, stats } = processCleaningAndStats(rawRows);

        return NextResponse.json({
            success: true,
            rawRows,
            cleanRows,
            exclusionLogs,
            stats,
        });
    } catch (error) {
        console.error("Admin GET error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memuat data dasbor admin." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        if (!isAuthorized(request)) {
            return NextResponse.json(
                { success: false, message: "Password admin tidak valid." },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const respondentId = searchParams.get("respondentId");

        if (!respondentId || !respondentId.startsWith("A03-")) {
            return NextResponse.json(
                { success: false, message: "Respondent ID tidak valid." },
                { status: 400 }
            );
        }

        // Karena ON DELETE CASCADE aktif, menghapus raw_data otomatis menghapus tabel anak
        const { error } = await supabaseAdmin
            .from("raw_data")
            .delete()
            .eq("respondent_id", respondentId);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: `Responden ${respondentId} beserta seluruh datanya berhasil dihapus.`,
        });
    } catch (error) {
        console.error("Admin DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal menghapus data responden." },
            { status: 500 }
        );
    }
}