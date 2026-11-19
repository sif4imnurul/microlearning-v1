import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdmin } from "@/lib/adminAuth";

export async function POST(request: Request) {
    if (!isAdmin(request)) {
        return NextResponse.json(
            { message: "Kunci admin salah." },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const respondentId = body?.respondentId;
        const action = body?.action;
        const reason =
            typeof body?.reason === "string" ? body.reason.trim() : "";

        if (
            typeof respondentId !== "string" ||
            !respondentId.startsWith("A03-")
        ) {
            return NextResponse.json(
                { message: "ID responden tidak valid." },
                { status: 400 }
            );
        }

        if (action !== "exclude" && action !== "restore") {
            return NextResponse.json(
                { message: "Aksi tidak valid." },
                { status: 400 }
            );
        }

        if (action === "exclude" && reason.length < 5) {
            return NextResponse.json(
                { message: "Alasan eksklusi wajib diisi (minimal 5 karakter)." },
                { status: 400 }
            );
        }

        const { data: respondent, error: respondentError } =
            await supabaseAdmin
                .from("raw_data")
                .select("respondent_id")
                .eq("respondent_id", respondentId)
                .maybeSingle();

        if (respondentError) {
            throw respondentError;
        }

        if (!respondent) {
            return NextResponse.json(
                { message: "Responden tidak ditemukan." },
                { status: 404 }
            );
        }

        const { error } = await supabaseAdmin.from("cleaning_log").insert({
            respondent_id: respondentId,
            action,
            reason: reason || "Dipulihkan",
        });

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin cleaning error:", error);

        return NextResponse.json(
            { message: "Gagal menyimpan cleaning log." },
            { status: 500 }
        );
    }
}