import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Missing Supabase environment variables')
        }

        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    }

    return supabaseInstance
}

// Cliente con permisos elevados (service_role) para escrituras en API routes
export function getSupabaseAdmin(): SupabaseClient {
    if (!supabaseAdminInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
        }

        supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey)
    }

    return supabaseAdminInstance
}

// Legacy export for backward compatibility (anon key, solo para lecturas)
export const supabase = {
    get from() {
        return getSupabase().from.bind(getSupabase())
    },
    get auth() {
        return getSupabase().auth
    }
}
