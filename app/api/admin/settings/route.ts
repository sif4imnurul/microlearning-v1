import { NextResponse, connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
    await connection();

    try {
        const { data, error } = await supabaseAdmin
            .from("app_settings")
            .select("value")
            .eq("key", "experiment_config")
            .maybeSingle();

        if (error || !data?.value) {
            return NextResponse.json({
                success: true,
                isExperiment: false,
                showFeedback: true,
            });
        }

        const config = data.value as {
            is_experiment?: boolean;
            show_feedback?: boolean;
        };

        return NextResponse.json({
            success: true,
            isExperiment: Boolean(config.is_experiment),
            showFeedback: Boolean(config.show_feedback),
        });
    } catch (error) {
        console.error("GET /api/settings error:", error);

        return NextResponse.json({
            success: true,
            isExperiment: false,
            showFeedback: true,
        });
    }
}