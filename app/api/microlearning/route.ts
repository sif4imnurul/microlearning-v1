import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const UNIT_COLUMNS = [
    "u1_seconds",
    "u2_seconds",
    "u3_seconds",
    "u4_seconds",
    "u5_seconds",
    "u6_seconds",
] as const;

function validRespondentId(value: unknown): value is string {
    return typeof value === "string" && value.startsWith("A03-");
}

export async function GET(request: Request) {
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

        let { data: progress, error } = await supabaseAdmin
            .from("microlearning_progress")
            .select("*")
            .eq("respondent_id", respondentId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!progress) {
            const { data: newProgress, error: insertError } =
                await supabaseAdmin
                    .from("microlearning_progress")
                    .insert({
                        respondent_id: respondentId,
                        current_unit: 1,
                        completed_units: [],
                    })
                    .select("*")
                    .single();

            if (insertError) {
                throw insertError;
            }

            progress = newProgress;
        }

        return NextResponse.json({
            success: true,
            progress,
        });
    } catch (error) {
        console.error("Microlearning GET error:", error);

        return NextResponse.json(
            { message: "Gagal mengambil progres Microlearning." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const respondentId = body?.respondentId;
        const unitNumber = Number(body?.unitNumber);
        const duration = Number(body?.duration);

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

        if (progress.current_unit !== unitNumber) {
            return NextResponse.json(
                { message: "Unit tidak sesuai urutan pengerjaan." },
                { status: 403 }
            );
        }

        const completedUnits = Array.isArray(progress.completed_units)
            ? progress.completed_units
            : [];

        if (completedUnits.includes(`U${unitNumber}`)) {
            return NextResponse.json(
                { message: "Unit ini sudah diselesaikan." },
                { status: 409 }
            );
        }

        const column = UNIT_COLUMNS[unitNumber - 1];

        const newCompletedUnits = [
            ...completedUnits,
            `U${unitNumber}`,
        ];

        const newCurrentUnit = unitNumber === 6 ? 7 : unitNumber + 1;

        const newTotalSeconds =
            Number(progress.total_seconds || 0) + duration;

        const updateData: Record<string, unknown> = {
            [column]: duration,
            completed_units: newCompletedUnits,
            current_unit: newCurrentUnit,
            total_seconds: newTotalSeconds,
            updated_at: new Date().toISOString(),
        };

        if (unitNumber === 6) {
            updateData.completed_at = new Date().toISOString();
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
                { message: "Unit ini sudah diselesaikan." },
                { status: 409 }
            );
        }

        const { error: rawError } = await supabaseAdmin
            .from("raw_data")
            .update({
                [column]: duration,
                total_treatment_seconds: newTotalSeconds,
            })
            .eq("respondent_id", respondentId);

        if (rawError) {
            throw rawError;
        }

        return NextResponse.json({
            success: true,
            message: `Unit ${unitNumber} berhasil diselesaikan.`,
            nextUnit: newCurrentUnit,
            totalSeconds: newTotalSeconds,
        });
    } catch (error) {
        console.error("Microlearning POST error:", error);

        return NextResponse.json(
            { message: "Gagal menyimpan progres Microlearning." },
            { status: 500 }
        );
    }
}