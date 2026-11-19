
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { buildAdminPayload } from "@/lib/adminData";

export async function GET(request: Request) {
    if (!isAdmin(request)) {
        return NextResponse.json(
            { message: "Kunci admin salah." },
            { status: 401 }
        );
    }

    try {
        const payload = await buildAdminPayload();

        return NextResponse.json(payload);
    } catch (error) {
        console.error("Admin data error:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Gagal memuat data admin.",
            },
            { status: 500 }
        );
    }
}
