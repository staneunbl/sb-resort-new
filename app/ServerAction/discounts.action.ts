"use server";
import { middleware } from "@/middleware";
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

export async function getAllDiscountRoomTypes() {
    const {data, error} = await supabase
        .from("DiscountRoomTypes")
        .select("*")
    
    if(error){
        console.log(error)
        throw new Error(error.message)
    }

    return {sucess: true, res: data}
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
    DiscountName: string,
    DiscountCode: string,
    DiscountType: string,
    DiscountValue: number,
    StartDate: string | null,
    EndDate: string | null,
    MinNight: number | null,
    MaxNight: number | null,
    MinAmount: number | null,
    MaxAmount: number | null,
    MaxUsage: number | null
}, roomIds: number[]) {
    const { data: discount, error } = await supabase
    .from("Discounts")
    .insert(data)
    .select()
    .single()

    console.log(discount)
    const discountId = discount?.Id;

    const promises = roomIds.map((roomId) =>
       addDiscountToRoomType(discountId, roomId)
    )

    const results = await Promise.all(promises);

    const hasError = results.some(result => result.success === false);

    if (hasError || error) {
        console.log(error || hasError); 
        return { success: false, res: [] };
    }

    // Return the successful results
    return {success: true, res: results.map(result => result.res)};
}

export async function addDiscountToRoomType(discountId: number, roomTypeId: number){
    const { data, error } = await supabase
        .from("DiscountRoomTypes")
        .insert({ DiscountId: discountId, RoomTypeId: roomTypeId })
        .select()
        .single()
    
    if (error) throw new Error(error.message)
    
    return { success: true, res: data }
}

export async function updateDiscount(data: {
    discountName: string,
    discountCode: string,
    discountType: string,
    discountValue: number,
    startDate: Date | null,
    endDate: Date | null,
    minNight: number | null,
    maxNight: number | null, 
    minAmount: number | null,
    maxAmount: number | null,
    maxUsage: number | null,
    id: number
}, rooms: {old: number[], new: number[]}) {
    const { data: discountEdit, error } = await supabase
        .from("Discounts")
        .update({
            "DiscountName": data.discountName,
            "DiscountCode": data.discountCode,
            "DiscountType": data.discountType,
            "DiscountValue": data.discountValue,
            "StartDate": data.startDate || null,
            "EndDate": data.endDate || null,
            "MinNight": data.minNight || null,
            "MinAmount": data.minAmount || null,
            "MaxNight": data.maxNight || null,
            "MaxUsage": data.maxUsage || null,
            "MaxAmount": data.maxAmount || null
        })
        .eq("Id", data.id)
        .select()
        .single()
    
    if (error) throw new Error(error.message);

    if(!(rooms.new == rooms.old)){
        const newRooms = rooms.new.filter((room: any) => !rooms.old.includes(room));
        const removedRooms = rooms.old.filter((room: any) => !rooms.new.includes(room));

        if(newRooms.length > 0 ){
            const { data: addRoom, error: addRoomError } = await supabase
                .from("DiscountRoomTypes")
                .insert(
                    newRooms.map((room: any) => ({RoomTypeId: room, DiscountId: data.id}))
                )
            if (addRoomError) throw new Error(addRoomError.message);
        }

        if(removedRooms.length > 0) {
            const { data: removeRoom, error: removeRoomError } = await supabase
                .from("DiscountRoomTypes")
                .delete()
                .eq("DiscountId", data.id)
                .in("RoomTypeId", removedRooms)
            if (removeRoomError) throw new Error(removeRoomError.message);
        }

        return { success: true, res: discountEdit };
    }

    return { success: true, res: discountEdit };
} 

export async function toggleDiscountStatus(discountId: number, status: boolean){
    console.log(`Performing Status Toggle on Id ${discountId} with status ${status}`)
    const { data: discountEdit, error } = await supabase
        .from("Discounts")
        .update({
            "IsActive": status
        })
        .eq("Id", discountId)
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

export async function checkDiscount (discountCode: string, details: {
    roomTypeId: number,
    startDate: Date,
    endDate: Date,
    nights: number,
    bill: number,
}) {
    console.log(discountCode, details)
    const { data, error } = await supabase
        .from("Discounts")
        .select("Id, DiscountName, DiscountCode, DiscountType, DiscountValue")
        .eq("DiscountCode", discountCode)
        .eq("IsActive", true)
        .eq("IsDeleted", false)
        .single()

    if(error || !data) {
        return { success: false, message: "Invalid or inactive discount code." , res: null }
    }
    
   
    const { data: discountRoomType, error: discountRoomTypeError } = await supabase
        .from("DiscountRoomTypes")
        .select("*")
        .eq("DiscountId", data.Id)
        .eq("RoomTypeId", details.roomTypeId)
        .single()
    
    if (discountRoomTypeError || !discountRoomType) {
        return { success: false, message: "Room type is not eligible for discount." , res: null }
    }

    if (discountRoomType.StartDate && discountRoomType.StartDate > details.startDate) {
        return { success: false, message: "Discount is not active yet." , res: null }
    }

    if (discountRoomType.EndDate && discountRoomType.EndDate < details.endDate) {
        return { success: false, message: "Discount has expired." , res: null }
    }

    if (discountRoomType.MinNight && discountRoomType.MinNight > details.nights) {
        return { success: false, message: "Minimum nights not met." , res: null }
    }

    if (discountRoomType.MaxNight && discountRoomType.MaxNight < details.nights) {  
        return { success: false, message: "Maximum nights exceeded." , res: null }
    }

    if (discountRoomType.MinAmount && discountRoomType.MinAmount > details.bill) {
        return { success: false, message: "Minimum bill not met." , res: null }
    }

    if (discountRoomType.MaxAmount && discountRoomType.MaxAmount < details.bill) {
        return { success: false, message: "Maximum bill exceeded." , res: null }
    }

    return {success: true, message: "Discount can be applied.", res: data}
}
