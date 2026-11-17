
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const respondentId = body?.respondentId;
        const answers = body?.answers;

        if (
            typeof respondentId !== "string" ||
            !respondentId.startsWith("A03-")
        ) {
            return NextResponse.json(
                { message: "ID responden tidak valid." },
                { status: 400 }
            );
        }

        if (
            !answers ||
            typeof answers !== "object" ||
            Array.isArray(answers)
        ) {
            return NextResponse.json(
                { message: "Data jawaban tidak valid." },
                { status: 400 }
            );
        }

        // Pastikan Pre-test sudah dikerjakan.
        const { data: pretest, error: pretestError } =
            await supabaseAdmin
                .from("pretest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (pretestError || !pretest) {
            return NextResponse.json(
                { message: "Data Pre-test tidak ditemukan." },
                { status: 400 }
            );
        }

        // Pastikan seluruh 6 unit sudah selesai.
        const { data: progress, error: progressError } =
            await supabaseAdmin
                .from("microlearning_progress")
                .select("current_unit, completed_units")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (
            progressError ||
            !progress ||
            progress.current_unit !== 7
        ) {
            return NextResponse.json(
                {
                    message:
                        "Selesaikan seluruh unit Microlearning sebelum mengerjakan Post-test.",
                },
                { status: 403 }
            );
        }

        const completedUnits = progress.completed_units;

        if (
            !Array.isArray(completedUnits) ||
            !["U1", "U2", "U3", "U4", "U5", "U6"].every(
                (unit) => completedUnits.includes(unit)
            )
        ) {
            return NextResponse.json(
                { message: "Seluruh unit Microlearning belum selesai." },
                { status: 403 }
            );
        }

        const dataJawaban: Record<string, number> = {};
        const dataConfidence: Record<string, number> = {};

        let totalConfidence = 0;

        for (let i = 1; i <= 12; i++) {
            const questionId = `P${i}`;

            const answer = answers[questionId]?.answer;
            const confidence = answers[questionId]?.confidence;

            if (
                !["A", "B", "C", "D"].includes(answer) ||
                !["1", "2", "3", "4", "5"].includes(confidence)
            ) {
                return NextResponse.json(
                    {
                        message: `Jawaban ${questionId} belum lengkap atau tidak valid.`,
                    },
                    { status: 400 }
                );
            }

            dataJawaban[`q${i}`] =
                ["A", "B", "C", "D"].indexOf(answer) + 1;

            dataConfidence[questionId] = Number(confidence);
            totalConfidence += Number(confidence);
        }

        const confidenceAverage = Number(
            (totalConfidence / 12).toFixed(2)
        );

        const { error: insertError } = await supabaseAdmin
            .from("posttest_responses")
            .insert({
                respondent_id: respondentId,
                ...dataJawaban,
                post_answers: Object.fromEntries(
                    Object.entries(dataJawaban).map(([key, value]) => [
                        key.toUpperCase(),
                        ["", "A", "B", "C", "D"][value],
                    ])
                ),
                confidence_post: dataConfidence,
                confidence_post_avg: confidenceAverage,
            });

        if (insertError) {
            console.error("Supabase Post-test error:", insertError);

            return NextResponse.json(
                {
                    message:
                        "Gagal menyimpan Post-test. Pastikan Post-test belum pernah dikirim.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Post-test berhasil disimpan.",
        });

    } catch (error) {
        console.error("Post-test error:", error);

        return NextResponse.json(
            { message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}
