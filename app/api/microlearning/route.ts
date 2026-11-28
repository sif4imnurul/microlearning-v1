import { NextResponse, connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const UNIT_COLUMNS = [
    "u1_seconds",
    "u2_seconds",
    "u3_seconds",
    "u4_seconds",
    "u5_seconds",
    "u6_seconds",
] as const;

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
};

function validRespondentId(value: unknown): value is string {
    return typeof value === "string" && value.startsWith("A03-");
}

export async function GET(request: Request) {
    await connection();

    try {
        const { searchParams } = new URL(request.url);
        const respondentId = searchParams.get("respondentId");

        if (!validRespondentId(respondentId)) {
            return NextResponse.json(
                { message: "ID responden tidak valid." },
                { status: 400 }
            );
        }

        const { data: pretest, error: pretestError } =
            await supabaseAdmin
                .from("pretest_responses")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (pretestError || !pretest) {
            return NextResponse.json(
                { message: "Pre-test belum ditemukan." },
                { status: 403 }
            );
        }

        const { data: initialProgress, error } = await supabaseAdmin
            .from("microlearning_progress")
            .select("*")
            .eq("respondent_id", respondentId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        let progress = initialProgress;

        if (!progress) {
            const { data: newProgress, error: insertError } =
                await supabaseAdmin
                    .from("microlearning_progress")
                    .insert({
                        respondent_id: respondentId,
                        current_unit: 1,
                        completed_units: [],
                        total_seconds: 0,
                    })
                    .select("*")
                    .single();

            if (insertError) {
                if (insertError.code === "23505") {
                    const { data: existingProgress, error: retryError } =
                        await supabaseAdmin
                            .from("microlearning_progress")
                            .select("*")
                            .eq("respondent_id", respondentId)
                            .single();

                    if (retryError || !existingProgress) {
                        throw retryError ?? insertError;
                    }

                    progress = existingProgress;
                } else {
                    throw insertError;
                }
            } else {
                progress = newProgress;
            }
        }

        return NextResponse.json(
            {
                success: true,
                progress,
            },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error: unknown) {
        console.error("Microlearning GET error:", error);
        const detail =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "";

        return NextResponse.json(
            {
                message: detail
                    ? `Gagal mengambil progres Microlearning: ${detail}`
                    : "Gagal mengambil progres Microlearning.",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const respondentId = body?.respondentId;
        const unitNumber = Number(body?.unitNumber);
        const rawDuration = Number(body?.duration);
        const duration = Number.isFinite(rawDuration)
            ? Math.max(1, Math.round(rawDuration))
            : NaN;

        if (!validRespondentId(respondentId)) {
            return NextResponse.json(
                { message: "ID responden tidak valid." },
                { status: 400 }
            );
        }

        if (
            !Number.isInteger(unitNumber) ||
            unitNumber < 1 ||
            unitNumber > 6
        ) {
            return NextResponse.json(
                { message: "Unit tidak valid." },
                { status: 400 }
            );
        }

        if (
            !Number.isInteger(duration) ||
            duration < 1 ||
            duration > 3600
        ) {
            return NextResponse.json(
                { message: "Durasi unit tidak valid." },
                { status: 400 }
            );
        }

        const { data: pretest } = await supabaseAdmin
            .from("pretest_responses")
            .select("respondent_id")
            .eq("respondent_id", respondentId)
            .maybeSingle();

        if (!pretest) {
            return NextResponse.json(
                { message: "Pre-test belum diselesaikan." },
                { status: 403 }
            );
        }

        const { data: progress, error: readError } =
            await supabaseAdmin
                .from("microlearning_progress")
                .select("*")
                .eq("respondent_id", respondentId)
                .single();

        if (readError || !progress) {
            return NextResponse.json(
                { message: "Progres Microlearning tidak ditemukan." },
                { status: 404 }
            );
        }

        const currentUnit = Number(progress.current_unit);
        const completedUnits = Array.isArray(progress.completed_units)
            ? progress.completed_units
            : [];

        if (
            completedUnits.includes(`U${unitNumber}`) ||
            (Number.isInteger(currentUnit) && currentUnit > unitNumber)
        ) {
            const fallbackNextUnit = unitNumber === 6 ? 7 : unitNumber + 1;
            const resolvedNextUnit =
                Number.isInteger(currentUnit) && currentUnit > unitNumber
                    ? currentUnit
                    : fallbackNextUnit;

            return NextResponse.json(
                {
                    message: "Unit ini sudah diselesaikan.",
                    nextUnit: resolvedNextUnit,
                },
                { status: 409, headers: NO_STORE_HEADERS }
            );
        }

        if (currentUnit !== unitNumber) {
            return NextResponse.json(
                {
                    message: "Unit tidak sesuai urutan pengerjaan.",
                    currentUnit: Number.isInteger(currentUnit)
                        ? currentUnit
                        : undefined,
                },
                { status: 403, headers: NO_STORE_HEADERS }
            );
        }

        const column = UNIT_COLUMNS[unitNumber - 1];
        const newCompletedUnits = [...completedUnits, `U${unitNumber}`];
        const newCurrentUnit = unitNumber === 6 ? 7 : unitNumber + 1;
        const newTotalSeconds =
            Number(progress.total_seconds || 0) + duration;
        const nowISO = new Date().toISOString();

        const updateData: Record<string, unknown> = {
            [column]: duration,
            completed_units: newCompletedUnits,
            current_unit: newCurrentUnit,
            total_seconds: newTotalSeconds,
            updated_at: nowISO,
        };

        if (unitNumber === 6) {
            updateData.completed_at = nowISO;
        }

        const { data: updated, error: updateError } =
            await supabaseAdmin
                .from("microlearning_progress")
                .update(updateData)
                .eq("respondent_id", respondentId)
                .eq("current_unit", unitNumber)
                .select("respondent_id");

        if (updateError) {
            throw updateError;
        }

        if (!updated || updated.length === 0) {
            return NextResponse.json(
                {
                    message: "Unit ini sudah diselesaikan.",
                    nextUnit: newCurrentUnit,
                },
                { status: 409, headers: NO_STORE_HEADERS }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: `Unit ${unitNumber} berhasil diselesaikan.`,
                nextUnit: newCurrentUnit,
                totalSeconds: newTotalSeconds,
            },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error: unknown) {
        console.error("Microlearning POST error:", error);
        const detail =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "";

        return NextResponse.json(
            {
                message: detail
                    ? `Gagal menyimpan progres Microlearning: ${detail}`
                    : "Gagal menyimpan progres Microlearning.",
            },
            { status: 500 }
        );
    }
}