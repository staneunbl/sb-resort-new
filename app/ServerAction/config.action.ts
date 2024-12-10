'use server';

import { createClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
const supabase = createClient()

export async function transformConfig() {
    const { data, error } = await supabase.from('Configuration').select('*')
    if(error){
        console.log(error)
        return {success: false, res: []}
    }
    // return {success: true, res: data}
    const config = data.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
      }, {}); 
    
    console.log("Configuration Transform ",config)

    return config;
}

export async function getConfig() {
    return useQuery({
        queryKey: ["GetConfig"],
        queryFn: async() => transformConfig()
    })
}

export async function updateConfig(companyName: string, companyLogo: string, companyContact: string, companyEmail: string, companyAddress: string, facebookUrl: string, instagramUrl: string, tiktokUrl: string, youtubeUrl: string, xUrl: string, termsOfService: string, privacyPolicy: string, paymentInstructions: string, cookieMessage: string){
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
        { key: "TermsOfService", value: termsOfService },
        { key: "PrivacyPolicy", value: privacyPolicy},
        { key: "PaymentInstructions", value: paymentInstructions},
        { key: "CookieMessage", value: cookieMessage} 
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
