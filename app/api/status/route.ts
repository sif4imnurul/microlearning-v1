import { NextResponse, connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(request: Request) {
    await connection();

    try {
        const { searchParams } = new URL(request.url);
        const respondentId = searchParams.get("respondentId");

        if (!respondentId || !respondentId.startsWith("A03-")) {
            return NextResponse.json(
                { stage: "demographic" },
                { headers: NO_STORE_HEADERS }
            );
        }

        const [demo, pre, post, progress] = await Promise.all([
            supabaseAdmin
                .from("raw_data")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
            supabaseAdmin
                .from("pretest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
            supabaseAdmin
                .from("posttest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
            supabaseAdmin
                .from("microlearning_progress")
                .select("current_unit")
                .eq("respondent_id", respondentId)
                .maybeSingle(),
        ]);

        if (demo.error || pre.error || post.error || progress.error) {
            return NextResponse.json(
                { message: "Gagal memeriksa status." },
                { status: 500, headers: NO_STORE_HEADERS }
            );
        }

        if (!demo.data) {
            return NextResponse.json(
                { stage: "demographic" },
                { headers: NO_STORE_HEADERS }
            );
        }

        if (!pre.data) {
            return NextResponse.json(
                { stage: "pretest" },
                { headers: NO_STORE_HEADERS }
            );
        }

        if (post.data) {
            return NextResponse.json(
                { stage: "done" },
                { headers: NO_STORE_HEADERS }
            );
        }

        const currentUnit = Number(progress.data?.current_unit ?? 1);

        if (currentUnit >= 7) {
            return NextResponse.json(
                { stage: "posttest" },
                { headers: NO_STORE_HEADERS }
            );
        }

        return NextResponse.json(
            {
                stage: "microlearning",
                currentUnit,
            },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error) {
        console.error("Status API error:", error);

        return NextResponse.json(
            { message: "Terjadi kesalahan pada server." },
            { status: 500, headers: NO_STORE_HEADERS }
        );
    }
}