"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// Server action to send password reset email
export async function sendPasswordResetEmail(email: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Password reset error:", err);
    return { success: false, error: "Terjadi kesalahan saat mengirim email reset." };
  }
}

// Server action to update password (for reset password page)
export async function updatePassword(code: string, newPassword: string) {
  try {
    const supabase = await createClient();
    
    // First exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      return { success: false, error: "Link reset password tidak valid atau sudah kadaluarsa." };
    }
    
    // Now update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Sign out after password change
    await supabase.auth.signOut();
    
    return { success: true };
  } catch (err) {
    console.error("Update password error:", err);
    return { success: false, error: "Terjadi kesalahan saat mengubah password." };
  }
}

// Server action to change password for logged in user
export async function changeUserPassword(newPassword: string) {
  try {
    const supabase = await createClient();
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "Anda harus login terlebih dahulu." };
    }
    
    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      if (error.message.includes("same")) {
        return { success: false, error: "Password baru harus berbeda dari password lama." };
      }
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Change password error:", err);
    return { success: false, error: "Terjadi kesalahan saat mengubah password." };
  }
}
