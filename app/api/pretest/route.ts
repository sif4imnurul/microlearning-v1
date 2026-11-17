
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
                { message: "Respondent ID tidak valid." },
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

            dataJawaban[`p${i}`] =
                ["A", "B", "C", "D"].indexOf(answer) + 1;

            dataConfidence[questionId] = Number(confidence);

            totalConfidence += Number(confidence);
        }

        const confidenceAverage = Number(
            (totalConfidence / 12).toFixed(2)
        );

        const { error } = await supabaseAdmin
            .from("pretest_responses")
            .insert({
                respondent_id: respondentId,
                ...dataJawaban,
                confidence_pre: dataConfidence,
                confidence_pre_avg: confidenceAverage,
                pre_score: null,
                accuracy_pre: null,
            });

        if (error) {
            console.error("Supabase error:", error);

            return NextResponse.json(
                { message: "Gagal menyimpan jawaban Pre-test." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Jawaban Pre-test berhasil disimpan.",
        });

    } catch (error) {
        console.error("Pre-test API error:", error);

        return NextResponse.json(
            { message: "Terjadi kesalahan pada server." },
            { status: 500 }
        );
    }
}
