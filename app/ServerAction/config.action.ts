'use server';

import { createClient } from "@/utils/supabase/server";
const supabase = createClient()

export async function getConfig() {
    const { data } = await supabase.from('config').select('*')
    return { data }
}
