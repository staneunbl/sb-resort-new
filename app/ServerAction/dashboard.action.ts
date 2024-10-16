"use server";
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export async function dashboardCheckIn() {
  const { data, error } = await supabase.from("dashboardcheckin").select();

  if (error) {
    console.log(error);
    return { success: false, res: [] };
  }
  return { success: true, res: data };
}
export async function dashboardCheckOut() {
  const { data, error } = await supabase.from("dashboardcheckout").select();

  if (error) {
    console.log(error);
    return { success: false, res: [] };
  }
  return { success: true, res: data };
}
export async function monthlySales() {
  const { data, error } = await supabase
    .from("MonthlyReservationCount")
    .select();

  if (error) {
    console.log(error);
    return { success: false, res: {} };
  }
  return { success: true, res: data };
}
export async function monthlyReservations() {
  const { data, error } = await supabase.from("MonthlyTotalSales").select();

  if (error) {
    console.log(error);
    return { success: false, res: {} };
  }
  return { success: true, res: data };
}
export async function thisMonthSales() {
  const { data, error } = await supabase
    .from("ThisMonthSales")
    .select()
    .single();
  console.log(data);

  if (error) {
    console.log(error);
    return { success: false, res: {} };
  }
  return { success: true, res: data };
}
export async function todaySales() {
  const { data, error } = await supabase.from("TodaySales").select().single();
  console.log(data);

  if (error) {
    console.log(error);
    return { success: false, res: {} };
  }
  return { success: true, res: data };
}
export async function todayBooking() {
  const { data, error } = await supabase
    .from("todaysbooking")
    .select()
    .single();
  console.log(data);
  if (error) {
    console.log(error);
    return { success: false, res: {} };
  }
  return { success: true, res: data };
}
