"use client";

import { useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        console.error("OAuth error:", error, errorDescription);
        router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`);
        return;
      }

      if (code) {
        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error("Exchange error:", exchangeError);
          router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`);
          return;
        }
      }

      // Get user and determine redirect
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if profile exists, if not create one
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          // Profile should be auto-created by trigger, but just in case
          const username = user.user_metadata?.username || 
                          user.user_metadata?.name?.toLowerCase().replace(/\s+/g, '_') ||
                          user.email?.split('@')[0] ||
                          `user_${Date.now()}`;

          await supabase.from("profiles").insert({
            id: user.id,
            username: username,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
          });

          router.push("/dashboard");
        } else {
          // Redirect based on role
          if (existingProfile.role === "admin" || existingProfile.role === "superadmin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } else {
        router.push("/login");
      }
    };

    handleCallback();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Memproses login...</h2>
        <p className="text-muted-foreground">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}

function CallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <AuthCallbackHandler />
    </Suspense>
  );
}
