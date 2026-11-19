
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type AnswerItem = {
    answer?: unknown;
    confidence?: unknown;
};

type AnswersData = {
    [key: string]: AnswerItem;
};

const answerScore: Record<string, number> = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
};

const requiredUnits = [
    "U1",
    "U2",
    "U3",
    "U4",
    "U5",
    "U6",
];

function isObject(value: unknown): value is AnswersData {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function hasOwn(
    object: object,
    key: string
): boolean {
    return Object.prototype.hasOwnProperty.call(object, key);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const respondentId = body.respondentId;
        const answers = body.answers;

        // VALIDASI RESPONDENT ID
        if (
            typeof respondentId !== "string" ||
            !respondentId.startsWith("A03-")
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID responden tidak valid.",
                },
                { status: 400 }
            );
        }

        // VALIDASI FORMAT JAWABAN
        if (!isObject(answers)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Format jawaban Post-test tidak valid.",
                },
                { status: 400 }
            );
        }

        // CEK DATA RESPONDEN
        const { data: respondent, error: respondentError } =
            await supabaseAdmin
                .from("raw_data")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (respondentError) {
            console.error(
                "Cek respondent error:",
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

        if (!respondent) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Data responden tidak ditemukan.",
                },
                { status: 404 }
            );
        }

        // CEK APAKAH POST-TEST SUDAH PERNAH DIKIRIM
        const { data: existingPosttest, error: existingError } =
            await supabaseAdmin
                .from("posttest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (existingError) {
            console.error(
                "Cek Post-test error:",
                existingError
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal memeriksa data Post-test.",
                },
                { status: 500 }
            );
        }

        if (existingPosttest) {
            return NextResponse.json(
                {
                    success: true,
                    alreadyExists: true,
                    message: "Post-test sudah pernah diisi.",
                },
                { status: 200 }
            );
        }

        // CEK PRE-TEST
        const { data: pretest, error: pretestError } =
            await supabaseAdmin
                .from("pretest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (pretestError) {
            console.error(
                "Cek Pre-test error:",
                pretestError
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal memeriksa data Pre-test.",
                },
                { status: 500 }
            );
        }

        if (!pretest) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Pre-test belum diselesaikan.",
                },
                { status: 400 }
            );
        }

        // CEK PROGRESS MICROLEARNING
        const { data: progress, error: progressError } =
            await supabaseAdmin
                .from("microlearning_progress")
                .select("current_unit, completed_units")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (progressError) {
            console.error(
                "Cek Microlearning progress error:",
                progressError
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal memeriksa progress Microlearning.",
                },
                { status: 500 }
            );
        }

        if (!progress || progress.current_unit !== 7) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Selesaikan seluruh unit Microlearning terlebih dahulu.",
                },
                { status: 400 }
            );
        }

        // CEK SELURUH UNIT SUDAH SELESAI
        const completedUnits = Array.isArray(
            progress.completed_units
        )
            ? progress.completed_units
            : [];

        const allUnitsCompleted = requiredUnits.every(
            (unit) => completedUnits.includes(unit)
        );

        if (!allUnitsCompleted) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Seluruh unit Microlearning belum diselesaikan.",
                },
                { status: 400 }
            );
        }

        // VALIDASI DAN MAPPING JAWABAN
        const dataJawaban: Record<string, number> = {};
        const dataConfidence: Record<string, number> = {};
        const postAnswers: Record<string, string> = {};

        let totalConfidence = 0;

        for (let i = 1; i <= 12; i++) {
            const questionId = `P${i}`;
            const answer = answers[questionId]?.answer;
            const confidence = answers[questionId]?.confidence;

            const confidenceNumber = Number(confidence);

            if (
                typeof answer !== "string" ||
                !hasOwn(answerScore, answer) ||
                !Number.isInteger(confidenceNumber) ||
                confidenceNumber < 1 ||
                confidenceNumber > 5
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Jawaban atau confidence ${questionId} tidak valid.`,
                    },
                    { status: 400 }
                );
            }

            dataJawaban[`q${i}`] = answerScore[answer];
            dataConfidence[`Q${i}`] = confidenceNumber;
            postAnswers[`Q${i}`] = answer;

            totalConfidence += confidenceNumber;
        }

        // HITUNG RATA-RATA CONFIDENCE
        const confidenceAverage = Number(
            (totalConfidence / 12).toFixed(2)
        );

        // DATA YANG AKAN DISIMPAN
        const posttestData = {
            respondent_id: respondentId,

            ...dataJawaban,

            post_answers: postAnswers,
            confidence_post: dataConfidence,
            confidence_post_avg: confidenceAverage,
        };

        // SIMPAN POST-TEST
        const { error: insertError } = await supabaseAdmin
            .from("posttest_responses")
            .insert(posttestData);

        if (insertError) {
            console.error(
                "Supabase Post-test error:",
                insertError
            );

            // JIKA DUPLIKAT KARENA REQUEST BERSAMAAN
            if (insertError.code === "23505") {
                const { data: duplicateData, error: duplicateError } =
                    await supabaseAdmin
                        .from("posttest_responses")
                        .select("respondent_id")
                        .eq("respondent_id", respondentId)
                        .maybeSingle();

                if (!duplicateError && duplicateData) {
                    return NextResponse.json(
                        {
                            success: true,
                            alreadyExists: true,
                            message: "Post-test sudah pernah diisi.",
                        },
                        { status: 200 }
                    );
                }
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal menyimpan jawaban Post-test. Silakan coba kembali.",
                },
                { status: 500 }
            );
        }

        // BERHASIL
        return NextResponse.json(
            {
                success: true,
                alreadyExists: false,
                message: "Post-test berhasil disimpan.",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Post-test API error:",
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
