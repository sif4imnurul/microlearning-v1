
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
    try {
        // Mengambil data dari request
        const body = await request.json();

        // Field yang wajib diisi
        const requiredFields = [
            "respondentId",
            "usia",
            "bidangStudi",
            "riwayatPelatihan",
            "pengalamanPhishing",
            "penggunaanMfa",
            "frekuensiEmail",
        ];

        // Memeriksa kelengkapan data
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

        // Memeriksa pilihan jawaban
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

        // Mengubah data ke format kolom database
        const dataDemografi = {
            respondent_id: body.respondentId,
            group_id: "A03",
            treatment: "Microlearning",
            usia: body.usia,
            bidang_studi: body.bidangStudi,
            riwayat_pelatihan:
                body.riwayatPelatihan === "Ya",
            pengalaman_phishing:
                body.pengalamanPhishing === "Ya",
            penggunaan_mfa:
                body.penggunaanMfa === "Ya",
            frekuensi_email: body.frekuensiEmail,
        };

        console.log(
            "Data demografi siap diproses:",
            dataDemografi
        );

        // Memeriksa apakah ID responden sudah tersimpan
        const { data: existingData, error: checkError } =
            await supabaseAdmin
                .from("raw_data")
                .select("respondent_id")
                .eq("respondent_id", body.respondentId)
                .maybeSingle();

        if (checkError) {
            console.error(
                "Supabase check error:",
                checkError
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Gagal memeriksa data responden",
                },
                { status: 500 }
            );
        }

        // Jika data sudah ada, tidak perlu insert ulang
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

        // Menyimpan data demografi jika belum ada
        const { data, error } = await supabaseAdmin
            .from("raw_data")
            .insert(dataDemografi)
            .select()
            .single();

        if (error) {
            console.error(
                "Supabase insert error:",
                error
            );

            // Menangani kemungkinan ID tersimpan
            // oleh request lain pada waktu bersamaan
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
            body.respondentId
        );

        return NextResponse.json({
            success: true,
            alreadyExists: false,
            message: "Data demografi berhasil disimpan",
            data,
        });

    } catch (error) {
        console.error(
            "Kesalahan API demographic:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Terjadi kesalahan saat memproses data",
            },
            { status: 500 }
        );
    }
}
