"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);

  useEffect(() => {
    // Check for error in URL (e.g., expired link)
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");
    
    if (errorParam) {
      setError(errorDesc || "Link reset password sudah kadaluarsa.");
      setIsInvalidLink(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setIsLoading(true);

    // Set timeout to prevent stuck loading
    const timeout = setTimeout(() => {
      setError("Request timeout. Silakan request link reset password baru.");
      setIsLoading(false);
    }, 10000);

    try {
      const supabase = createClient();
      const code = searchParams.get("code");
      
      // If there's a code, try to exchange it first
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          clearTimeout(timeout);
          setError("Link tidak valid atau sudah kadaluarsa. Silakan request link baru.");
          setIsLoading(false);
          return;
        }
      }
      
      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      
      clearTimeout(timeout);
      
      if (updateError) {
        if (updateError.message.includes("session") || updateError.message.includes("logged in")) {
          setError("Session tidak valid. Silakan request link reset password baru.");
        } else {
          setError(updateError.message);
        }
        setIsLoading(false);
      } else {
        setSuccess(true);
        // Sign out and redirect to login
        await supabase.auth.signOut();
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      clearTimeout(timeout);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  // Error state - invalid or expired link
  if (isInvalidLink) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Link Tidak Valid</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Card>
          <CardContent className="p-6">
            <Button variant="gradient" className="w-full" asChild>
              <Link href="/forgot-password">
                Minta Link Baru
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Password Berhasil Diubah!</h1>
        <p className="text-muted-foreground mb-6">
          Password Anda telah berhasil direset. Anda akan diarahkan ke halaman login...
        </p>
        <Card>
          <CardContent className="p-6">
            <Button variant="gradient" className="w-full" asChild>
              <Link href="/login">
                Ke Halaman Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        <p className="text-muted-foreground">
          Masukkan password baru untuk akun Anda.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ResetPasswordLoading() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
