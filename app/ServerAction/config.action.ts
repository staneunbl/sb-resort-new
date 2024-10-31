'use server';

import { createClient } from "@/utils/supabase/server";
const supabase = createClient()

export async function getConfig() {
    const { data, error } = await supabase.from('Configuration').select('*')
    if(error){
        console.log(error)
        return {success: false, res: []}
      }
    return {success: true, res: data}
}

export async function updateConfig(companyName: string, companyLogo: string, companyContact: string, companyEmail: string, companyAddress: string, facebookUrl: string, instagramUrl: string, tiktokUrl: string, youtubeUrl: string, xUrl: string){
     // Prepare the updates based on the key
     const updates = [
        { key: 'CompanyName', value: companyName },
        { key: 'CompanyLogo', value: companyLogo },
        { key: 'CompanyContact', value: companyContact },
        { key: 'CompanyEmail', value: companyEmail },
        { key: 'CompanyAddress', value: companyAddress },
        { key: 'FacebookUrl', value: facebookUrl },
        { key: 'InstagramUrl', value: instagramUrl },
        { key: 'TiktokUrl', value: tiktokUrl },
        { key: 'YoutubeUrl', value: youtubeUrl },
        { key: 'XUrl', value: xUrl },
    ];

    // Perform the updates
    const promises = updates.map(({ key, value }) =>
        supabase
            .from('Configuration')
            .update({ value })
            .match({ key }) // Match based on the key
            .select()
    );

    // Wait for all updates to complete
    const results = await Promise.all(promises);
    
    // Check for errors
    const hasError = results.some(result => result.error);
    
    if (hasError) {
        // Log errors from results
        results.forEach(result => {
            if (result.error) {
                console.log(result.error);
            }
        });
        return { success: false, res: [] };
    }

    // Return the successful results
    return { success: true, res: results.map(result => result.data) };
}
