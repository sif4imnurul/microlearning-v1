import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const respondentId = searchParams.get("respondentId");

        if (!respondentId || !respondentId.startsWith("A03-")) {
            return NextResponse.json({ stage: "demographic" });
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
                { status: 500 }
            );
        }

        if (!demo.data) {
            return NextResponse.json({ stage: "demographic" });
        }

        if (!pre.data) {
            return NextResponse.json({ stage: "pretest" });
        }

        if (post.data) {
            return NextResponse.json({ stage: "done" });
        }

        const currentUnit = progress.data?.current_unit ?? 1;

        if (currentUnit >= 7) {
            return NextResponse.json({ stage: "posttest" });
        }

        return NextResponse.json({
            stage: "microlearning",
            currentUnit,
        });
    } catch (error) {
        console.error("Status API error:", error);

        return NextResponse.json(
            { message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}