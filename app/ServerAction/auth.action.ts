"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function Login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error?.message === "Invalid login credentials") {
    return redirect("/login?message=Invalid Email or Password");
  }
  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }
  /* For Audit setting connection session user Id */
  const { error: error2 } = await supabase.rpc("set_current_user_id", {
    user_id: data.user?.id,
  });
  if (error2) {
    return redirect("/login?message=Could not authenticate user");
  }

  revalidatePath("/dashboard", "layout");
}
export async function Register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const supabase = createClient();

  if (password !== confirmPassword) {
    return redirect("/register?message=Passwords do not match");
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `https://${process.env.LOCAL_URL}/auth/callback`,
      data: {
        firstName: firstName,
        lastName: lastName,
        roleId: 1,
      },
    },
  });

  if (error) {
    console.log(error);
    return redirect(`/register?message=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
export async function CreateUser(data: any) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `https://${process.env.LOCAL_URL}/auth/callback`,
      /* Put here Additional User Data */
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: 1,
      },
    },
  });
  if (error) {
    return redirect(`/register?message=${error.message}`);
  }
}
export async function Logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
export async function UpdatePassword(passowrd: string) {
  const supabase = createClient();
  const { error, data: resetData } = await supabase.auth.updateUser({
    password: passowrd,
  });
  if (error) {
    throw new Error(error.message);
  }
  return { success: true, res: resetData };
}
