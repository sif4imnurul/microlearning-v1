import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        "Variabel SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diatur di .env.local"
    );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);