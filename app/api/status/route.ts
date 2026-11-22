import { NextResponse, connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        await connection();

        const { searchParams } = new URL(request.url);
        const respondentId = searchParams.get("respondentId");

        if (!respondentId || !respondentId.startsWith("A03-")) {
            return NextResponse.json(
                { success: false, message: "Respondent ID tidak valid." },
                { status: 400 }
            );
        }

        const [rawRes, preRes, mlRes, postRes] = await Promise.all([
            supabaseAdmin
                .from("raw_data")
                .select("respondent_id, is_completed, session_type")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
            supabaseAdmin
                .from("pretest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
            supabaseAdmin
                .from("microlearning_progress")
                .select("respondent_id, completed_units, total_seconds")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
            supabaseAdmin
                .from("posttest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
        ]);

        if (rawRes.error) throw rawRes.error;
        if (preRes.error) throw preRes.error;
        if (mlRes.error) throw mlRes.error;
        if (postRes.error) throw postRes.error;

        if (!rawRes.data) {
            return NextResponse.json(
                { success: false, message: "Data responden tidak ditemukan." },
                { status: 404 }
            );
        }

        const completedUnitsCount = Array.isArray(mlRes.data?.completed_units)
            ? mlRes.data.completed_units.length
            : 0;

        return NextResponse.json({
            success: true,
            respondent_id: respondentId,
            session_type: rawRes.data.session_type,
            has_pretest: Boolean(preRes.data),
            completed_units_count: completedUnitsCount,
            total_treatment_seconds: Number(mlRes.data?.total_seconds ?? 0),
            has_posttest: Boolean(postRes.data),
            is_completed: Boolean(rawRes.data.is_completed),
        });
    } catch (error) {
        console.error("Status API error:", error);
        return NextResponse.json(
            { success: false, message: "Gagal memuat status responden." },
            { status: 500 }
        );
    }
}