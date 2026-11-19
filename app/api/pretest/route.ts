
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type AnswerItem = {
    answer?: unknown;
    confidence?: unknown;
};

type AnswersData = {
    [key: string]: AnswerItem;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const respondentId = body?.respondentId;
        const answers = body?.answers;

        // Validasi ID responden
        if (
            typeof respondentId !== "string" ||
            !respondentId.startsWith("A03-")
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Respondent ID tidak valid.",
                },
                { status: 400 }
            );
        }

        // Validasi format jawaban
        if (
            !answers ||
            typeof answers !== "object" ||
            Array.isArray(answers)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Data jawaban tidak valid.",
                },
                { status: 400 }
            );
        }

        const pretestAnswers = answers as AnswersData;

        const dataJawaban: Record<string, number> = {};
        const dataConfidence: Record<string, number> = {};

        const answerScore: Record<string, number> = {
            A: 1,
            B: 2,
            C: 3,
            D: 4,
        };

        let totalConfidence = 0;

        // Validasi 12 jawaban Pre-test
        for (let i = 1; i <= 12; i++) {
            const questionId = `P${i}`;

            const answer = pretestAnswers[questionId]?.answer;
            const confidence =
                pretestAnswers[questionId]?.confidence;

            const confidenceNumber = Number(confidence);

            if (
                typeof answer !== "string" ||
                !Object.prototype.hasOwnProperty.call(
                    answerScore,
                    answer
                ) ||
                !Number.isInteger(confidenceNumber) ||
                confidenceNumber < 1 ||
                confidenceNumber > 5
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Jawaban ${questionId} belum lengkap atau tidak valid.`,
                    },
                    { status: 400 }
                );
            }

            dataJawaban[`p${i}`] = answerScore[answer];

            dataConfidence[questionId] = confidenceNumber;

            totalConfidence += confidenceNumber;
        }

        const confidenceAverage = Number(
            (totalConfidence / 12).toFixed(2)
        );

        // Memastikan ID sudah terdaftar dari Demographic
        const { data: respondentData, error: respondentError } =
            await supabaseAdmin
                .from("raw_data")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (respondentError) {
            console.error(
                "Supabase respondent check error:",
                respondentError
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal memeriksa data responden.",
                },
                { status: 500 }
            );
        }

        if (!respondentData) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Data demografi belum tersimpan. Silakan periksa kembali.",
                },
                { status: 404 }
            );
        }

        // Memeriksa apakah Pre-test sudah pernah disimpan
        const {
            data: existingPretest,
            error: checkError,
        } = await supabaseAdmin
            .from("pretest_responses")
            .select("respondent_id")
            .eq("respondent_id", respondentId)
            .maybeSingle();

        if (checkError) {
            console.error(
                "Supabase Pre-test check error:",
                checkError
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal memeriksa jawaban Pre-test.",
                },
                { status: 500 }
            );
        }

        // Jika sudah ada, jangan insert ulang
        if (existingPretest) {
            console.log(
                "Pre-test sudah tersimpan:",
                respondentId
            );

            return NextResponse.json({
                success: true,
                alreadyExists: true,
                message: "Jawaban Pre-test sudah tersimpan.",
            });
        }

        // Menyimpan jawaban Pre-test
        const { error: insertError } = await supabaseAdmin
            .from("pretest_responses")
            .insert({
                respondent_id: respondentId,
                ...dataJawaban,
                confidence_pre: dataConfidence,
                confidence_pre_avg: confidenceAverage,
                pre_score: null,
                accuracy_pre: null,
            });

        if (insertError) {
            console.error(
                "Supabase Pre-test insert error:",
                insertError
            );

            // Menangani kemungkinan request bersamaan
            if (insertError.code === "23505") {
                const {
                    data: duplicateData,
                    error: duplicateError,
                } = await supabaseAdmin
                    .from("pretest_responses")
                    .select("respondent_id")
                    .eq("respondent_id", respondentId)
                    .maybeSingle();

                if (!duplicateError && duplicateData) {
                    return NextResponse.json({
                        success: true,
                        alreadyExists: true,
                        message:
                            "Jawaban Pre-test sudah tersimpan.",
                    });
                }
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal menyimpan jawaban Pre-test.",
                },
                { status: 500 }
            );
        }

        console.log(
            "Pre-test berhasil disimpan:",
            respondentId
        );

        return NextResponse.json({
            success: true,
            alreadyExists: false,
            message: "Jawaban Pre-test berhasil disimpan.",
        });

    } catch (error) {
        console.error(
            "Pre-test API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan pada server.",
            },
            { status: 500 }
        );
    }
}
