"use server";
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export async function getPromos() {
    const { data, error } = await supabase
        .from("Promos")
        .select("*, ...RoomRates(*,...RoomTypes(RoomType:TypeName))").neq("isDeleted", true);
    if (error) {
        throw new Error(error.message);
    }
    return { success: true, res: data };
}
export async function addPromos(data: any) {
    console.log(data);
    const { error } = await supabase.rpc("add_promo", {
        roomtypeid: data.RoomTypeId,
        baseroomrate: data.BaseRoomRate,
        extraadultrate: data.ExtraAdultRate,
        extrachildrate: data.ExtraChildRate,
        statusid: 1,
        promocode: data.PromoCode,
        promoname: data.PromoName,
        redemptioncount: data.RedemptionCount,
        expiredat: data.ExpiredAt
    })
    if (error) {
        console.log(error.message)
        return { success: false, res: error.message };
    }
    return { success: true, res: data };
}
export async function updatePromos(data: any) {
    console.log(data);
    const { error } = await supabase.rpc("update_promo", {
        roomtypeid: data.RoomTypeId,
        roomrateid: data.roomrateid,
        baseroomrate: data.BaseRoomRate,
        extraadultrate: data.ExtraAdultRate,
        extrachildrate: data.ExtraChildRate,
        promocode: data.PromoCode,
        promoname: data.PromoName,
        redemptioncount: data.RedemptionCount,
        expiredat: data.ExpiredAt
    })
    if (error) {
        console.log(error)
        return { success: false, res: error.message }
    }
    return { success: true, res: data };
}
export async function deletePromo(id: string) {
    const { error } = await supabase
        .from("Promos")
        .update({ isDeleted: 1 })
        .eq("PromoDetailId", id);
    if (error) {
        return { success: false };
    }
    return { success: true };
}

/* Public endpoint */
export async function getPromo(promoCode: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from("Promos")
        .select("*, ...RoomRates(RoomTypeId,...RoomTypes(RoomType:TypeName))")
        .eq("PromoCode", promoCode)
        .gte("ExpiredAt", today).single();
    if (error || !data) {
        return { success: false, res: data };
    }
    console.log(data)
    return { success: true, res: data };
}