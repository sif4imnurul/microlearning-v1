import { NextResponse, connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type SessionType = "pilot" | "experiment";

function parseSessionValue(raw: unknown): SessionType {
    if (raw === "experiment") return "experiment";
    if (raw === "pilot") return "pilot";

    if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        const candidate = obj.session_type ?? obj.mode ?? obj.value;
        if (candidate === "experiment") return "experiment";
        if (candidate === "pilot") return "pilot";
        if (obj.is_experiment === true || obj.isExperiment === true) {
            return "experiment";
        }
        if (obj.is_pilot === false || obj.isPilot === false) return "experiment";
    }

    return "pilot";
}

function normalizeInputSession(value: unknown): SessionType | null {
    if (value === "pilot" || value === "experiment") return value;
    if (typeof value === "boolean") return value ? "pilot" : "experiment";
    return null;
}

function isAuthorized(request: Request, body?: Record<string, unknown>): boolean {
    const validPassword =
        process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY;

    if (!validPassword) return false;

    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : null;

    const providedPassword =
        request.headers.get("x-admin-password") ||
        request.headers.get("x-admin-key") ||
        bearerToken ||
        (typeof body?.password === "string" ? body.password : null) ||
        (typeof body?.adminPassword === "string" ? body.adminPassword : null) ||
        (typeof body?.adminKey === "string" ? body.adminKey : null);

    return providedPassword === validPassword;
}

export async function GET() {
    try {
        await connection();

        const { data, error } = await supabaseAdmin
            .from("app_settings")
            .select("key, value, updated_at")
            .in("key", [
                "session_type",
                "experiment_config",
                "experiment_mode",
                "settings",
            ]);

        if (error) {
            throw error;
        }

        const matchedRow =
            data?.find((row) => row.key === "session_type") ??
            data?.find((row) => row.key === "experiment_config") ??
            data?.find((row) => row.key === "experiment_mode") ??
            data?.find((row) => row.key === "settings");

        const sessionType = parseSessionValue(matchedRow?.value);
        const isExperiment = sessionType === "experiment";

        const expConfigRow = data?.find((row) => row.key === "experiment_config");
        const expConfigObj =
            expConfigRow?.value && typeof expConfigRow.value === "object"
                ? (expConfigRow.value as Record<string, unknown>)
                : null;
        const showFeedback =
            typeof expConfigObj?.show_feedback === "boolean"
                ? expConfigObj.show_feedback
                : true;

        return NextResponse.json({
            success: true,
            session_type: sessionType,
            sessionType,
            mode: sessionType,
            isPilot: !isExperiment,
            isExperiment,
            showFeedback,
        });
    } catch (error) {
        console.error("Settings GET error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Gagal mengambil pengaturan eksperimen.",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Record<string, unknown>;

        if (!isAuthorized(request, body)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password admin tidak valid.",
                },
                { status: 401 }
            );
        }

        const nextSession = normalizeInputSession(
            body.session_type ?? body.sessionType ?? body.mode ?? body.isPilot
        );

        if (!nextSession) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Mode sesi harus bernilai 'pilot' atau 'experiment'.",
                },
                { status: 400 }
            );
        }

        const nowIso = new Date().toISOString();
        const isExperiment = nextSession === "experiment";

        const { error } = await supabaseAdmin
            .from("app_settings")
            .upsert(
                [
                    {
                        key: "session_type",
                        value: nextSession,
                        updated_at: nowIso,
                    },
                    {
                        key: "experiment_config",
                        value: {
                            is_experiment: isExperiment,
                            show_feedback: true,
                        },
                        updated_at: nowIso,
                    },
                ],
                { onConflict: "key" }
            );

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: `Mode berhasil diubah ke ${nextSession}.`,
            session_type: nextSession,
            sessionType: nextSession,
            mode: nextSession,
            isPilot: !isExperiment,
            isExperiment,
            showFeedback: true,
        });
    } catch (error) {
        console.error("Settings POST error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Gagal memperbarui pengaturan eksperimen.",
            },
            { status: 500 }
        );
    }
}