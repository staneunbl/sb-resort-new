"use server";
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export async function getSalesReport() {
    console.log("hello");
    const { data, error } = await supabase
        .from("salesview")
        .select("*");
    if (error) {
        console.log(error);
        return { success: false, res: data };
    }
    return { success: true, res: data };
}
export async function getSalesReportChart() {
    const { data, error } = await supabase
        .from("monthlysalesreport")
        .select("date,payment")
        .limit(6)
        .order("date", { ascending: false });
    if (error) {
        console.log(error);
        return { success: false, res: error.message };
    }
    return { success: true, res: data };
}
export async function getAuditLog() {
    const { data, error } = await supabase
        .from("AuditLog")
        .select("*, ...AuditLogActions(ActionName, ActionId:Id), ...UserProfile(FirstName, LastName)");
    if (error) {
        console.log(error);
        return { success: false, res: error.message };
    }
    return { success: true, res: data };
}
export async function getDeviceReservation() {
    const { data, error } = await supabase
        .from("DeviceView").select("*");
    if (error) {
        console.log(error);
        return { success: false, res: error.message };
    }
    return { success: true, res: data };

}
