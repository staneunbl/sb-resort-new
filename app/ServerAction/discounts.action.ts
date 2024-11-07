"use server";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export async function getDiscounts() {
    const { data, error } = await supabase
    .from("Discounts")
    .select("*")
    .eq("IsDeleted", false)

    console.log(data)

    if (error) { 
        console.log(error) 
        throw new Error(error.message) 
    }

    return {success: true, res: data}
}

export async function getDiscount(id: number) {
    const { data, error } = await supabase
    .from("Discounts")
    .select("*")
    .eq("Id", id)
    .single()

    if (error) { 
        console.log(error) 
        throw new Error(error.message) 
    }

    return {success: true, res: data}
}

export async function deleteDiscount(id: number) {
    const { data, error } = await supabase
    .from("Discounts")
    .update({ "IsDeleted": true })
    .select()

    if (error) { 
        console.log(error) 
        throw new Error(error.message) 
    }

    return {success: true, res: data}
}

export async function addDiscount(data: {
    discountName: string,
    discountCode: string,
    discountType: "Flat" | "Percentage",
    discountValue: number,
    startDate: Date,
    endDate: Date,
    isActive: boolean,
    isDeleted: boolean,
    minNights: number,
    minAmount: number,
}, roomIds: number[]) {
    const { data: discount, error } = await supabase
    .from("Discounts")
    .insert(data)
    .select()
    .single()

    const discountId = discount?.Id;

    const promises = roomIds.map((roomId) =>
       removeDiscountFromRoomType(discountId, roomId)
    )

    const results = await Promise.all(promises);

    const hasError = results.some(result => result.success === false);

    if (hasError) {
        return { success: false, res: [] };
    }

    // Return the successful results
    return { success: true, res: results.map(result => result.success === true) };
}

export async function addDiscountToRoomType(discountId: number, roomTypeId: number){
    const { data, error } = await supabase
        .from("DiscountRoomType")
        .insert({ DiscountId: discountId, RoomTypeId: roomTypeId })
        .select()
        .single()
    
    if (error) throw new Error(error.message)
    
    return { success: true, res: data }
}

export async function updateDiscount(data: {
    discountName: string,
    discountCode: string,
    discountType: "Flat" | "Percentage",
    discountValue: number,
    startDate: Date,
    endDate: Date,
    isActive: boolean,
    isDeleted: boolean,
    minNights: number,
    minAmount: number,
}) {
    const { data: discountEdit, error } = await supabase
        .from("Discounts")
        .update({
            "DiscountName": data.discountName,
            "DiscountCode": data.discountCode,
            "DiscountType": data.discountType,
            "DiscountValue": data.discountValue,
            "StartDate": data.startDate,
            "EndDate": data.endDate,
            "IsActive": data.isActive,
            "IsDeleted": data.isDeleted,
            "MinNights": data.minNights,
            "MinAmount": data.minAmount
        })
        .select()
        .single()
    
    if (error) throw new Error(error.message);

    return { success: true, res: discountEdit };
} 

export async function removeDiscountFromRoomType(discountId: number, roomTypeId: number){
    const { data, error } = await supabase
        .from("DiscountRoomType")
        .delete()
        .eq("DiscountId", discountId)
        .eq("RoomTypeId", roomTypeId)
        .select()
        .single()
    
    if (error) throw new Error(error.message)
    
    return { success: true, res: data }
}

export async function removeDiscount(discountId: number){
    const { data, error } = await supabase
        .from("Discounts")
        .update({"IsDeleted": true})
        .eq("Id", discountId)
    
    if (error) throw new Error(error.message)
    
    return { success: true, res: data }
}
