import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const respondentId = body?.respondentId;
        const rawFeedback = body?.feedback;

        if (
            typeof respondentId !== "string" ||
            !respondentId.startsWith("A03-")
        ) {
            return NextResponse.json(
                { success: false, message: "ID responden tidak valid." },
                { status: 400 }
            );
        }

        if (typeof rawFeedback !== "string") {
            return NextResponse.json(
                { success: false, message: "Format saran tidak valid." },
                { status: 400 }
            );
        }

        const trimmedFeedback = rawFeedback.trim();

        if (trimmedFeedback.length === 0) {
            return NextResponse.json(
                { success: false, message: "Saran tidak boleh kosong." },
                { status: 400 }
            );
        }

        if (trimmedFeedback.length > 1000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Saran maksimal 1000 karakter.",
                },
                { status: 400 }
            );
        }

        // Pastikan responden sudah menyelesaikan Post-test
        const { data: posttest, error: posttestError } = await supabaseAdmin
            .from("posttest_responses")
            .select("respondent_id")
            .eq("respondent_id", respondentId)
            .maybeSingle();

        if (posttestError) {
            console.error("Cek posttest feedback error:", posttestError);
            return NextResponse.json(
                { success: false, message: "Gagal memverifikasi responden." },
                { status: 500 }
            );
        }

        if (!posttest) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Selesaikan Post-test terlebih dahulu.",
                },
                { status: 403 }
            );
        }

        const { error: updateError } = await supabaseAdmin
            .from("raw_data")
            .update({
                feedback: trimmedFeedback,
                feedback_submitted_at: new Date().toISOString(),
            })
            .eq("respondent_id", respondentId);

        if (updateError) {
            console.error("Simpan feedback error:", updateError);
            return NextResponse.json(
                { success: false, message: "Gagal menyimpan saran." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Saran berhasil disimpan.",
        });
    } catch (error) {
        console.error("POST /api/feedback error:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}