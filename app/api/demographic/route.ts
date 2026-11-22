import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type SessionType = "pilot" | "experiment";

function resolveSessionFromRows(
    rows: Array<{ key?: string; value?: unknown }> | null | undefined
): SessionType {
    if (!rows || rows.length === 0) return "pilot";

    const bySessionKey = rows.find((r) => r.key === "session_type");
    if (bySessionKey) {
        if (bySessionKey.value === "experiment") return "experiment";
        if (bySessionKey.value === "pilot") return "pilot";
        if (
            bySessionKey.value &&
            typeof bySessionKey.value === "object" &&
            (bySessionKey.value as { session_type?: unknown }).session_type ===
            "experiment"
        ) {
            return "experiment";
        }
    }

    const byExperimentConfig = rows.find((r) => r.key === "experiment_config");
    if (
        byExperimentConfig?.value &&
        typeof byExperimentConfig.value === "object"
    ) {
        const cfg = byExperimentConfig.value as {
            is_experiment?: unknown;
            isExperiment?: unknown;
        };
        if (cfg.is_experiment === true || cfg.isExperiment === true) {
            return "experiment";
        }
    }

    return "pilot";
}

async function getActiveSessionType(): Promise<SessionType> {
    const { data, error } = await supabaseAdmin
        .from("app_settings")
        .select("key, value")
        .in("key", ["session_type", "experiment_config", "experiment_mode", "settings"]);

    if (error) {
        console.error("Gagal membaca session_type dari app_settings:", error);
        return "pilot";
    }

    return resolveSessionFromRows(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const requiredFields = [
            "respondentId",
            "usia",
            "bidangStudi",
            "riwayatPelatihan",
            "pengalamanPhishing",
            "penggunaanMfa",
            "frekuensiEmail",
        ];

        const isComplete = requiredFields.every(
            (field) =>
                typeof body[field] === "string" &&
                body[field].trim() !== ""
        );

        if (!isComplete) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Data demografi belum lengkap",
                },
                { status: 400 }
            );
        }

        const isValid =
            ["18-20", "21-23", "24+"].includes(body.usia) &&
            ["IT/Komputer", "Non-IT", "Lainnya"].includes(
                body.bidangStudi
            ) &&
            ["Ya", "Tidak"].includes(body.riwayatPelatihan) &&
            ["Ya", "Tidak"].includes(body.pengalamanPhishing) &&
            ["Ya", "Tidak"].includes(body.penggunaanMfa) &&
            [
                "Jarang",
                "Beberapa kali/minggu",
                "Setiap hari",
            ].includes(body.frekuensiEmail);

        if (!isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Pilihan jawaban tidak valid",
                },
                { status: 400 }
            );
        }

        // Memeriksa apakah ID responden sudah tersimpan
        const { data: existingData, error: checkError } =
            await supabaseAdmin
                .from("raw_data")
                .select("respondent_id")
                .eq("respondent_id", body.respondentId)
                .maybeSingle();

        if (checkError) {
            console.error("Supabase check error:", checkError);
            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal memeriksa data responden",
                },
                { status: 500 }
            );
        }

        if (existingData) {
            console.log(
                "Data demografi sudah tersimpan:",
                body.respondentId
            );
            return NextResponse.json({
                success: true,
                alreadyExists: true,
                message: "Data demografi sudah tersimpan",
            });
        }

        // Ambil mode sesi aktif saat data baru masuk
        const activeSessionType = await getActiveSessionType();

        const dataDemografi = {
            respondent_id: body.respondentId,
            group_id: "A03",
            treatment: "Microlearning",
            session_type: activeSessionType,
            usia: body.usia,
            bidang_studi: body.bidangStudi,
            riwayat_pelatihan: body.riwayatPelatihan === "Ya",
            pengalaman_phishing: body.pengalamanPhishing === "Ya",
            penggunaan_mfa: body.penggunaanMfa === "Ya",
            frekuensi_email: body.frekuensiEmail,
        };

        console.log("Data demografi siap diproses:", dataDemografi);

        const { data, error } = await supabaseAdmin
            .from("raw_data")
            .insert(dataDemografi)
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);

            if (error.code === "23505") {
                const { data: duplicateData, error: duplicateError } =
                    await supabaseAdmin
                        .from("raw_data")
                        .select("respondent_id")
                        .eq("respondent_id", body.respondentId)
                        .maybeSingle();

                if (!duplicateError && duplicateData) {
                    return NextResponse.json({
                        success: true,
                        alreadyExists: true,
                        message: "Data demografi sudah tersimpan",
                    });
                }
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal menyimpan data demografi",
                },
                { status: 500 }
            );
        }

        console.log(
            "Data demografi berhasil disimpan:",
            body.respondentId,
            "| session_type:",
            activeSessionType
        );

        return NextResponse.json({
            success: true,
            alreadyExists: false,
            message: "Data demografi berhasil disimpan",
            data,
        });
    } catch (error) {
        console.error("Kesalahan API demographic:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan saat memproses data",
            },
            { status: 500 }
        );
    }
}