import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
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

// Lazy export that creates client only when .from() or .auth is accessed
export const supabase = {
    get from() {
        return getSupabase().from.bind(getSupabase())
    },
    get auth() {
        return getSupabase().auth
    }
}
