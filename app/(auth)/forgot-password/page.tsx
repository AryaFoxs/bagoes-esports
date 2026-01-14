"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Set timeout to prevent stuck loading
    const timeout = setTimeout(() => {
      setError("Request timeout. Silakan coba lagi.");
      setIsLoading(false);
    }, 10000);

    try {
      const supabase = createClient();
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      clearTimeout(timeout);
      
      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
      }
    } catch (err) {
      clearTimeout(timeout);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Email Terkirim!</h1>
        <p className="text-muted-foreground mb-6">
          Kami telah mengirimkan link reset password ke <strong>{email}</strong>. 
          Silakan cek inbox atau folder spam Anda.
        </p>
        <Card>
          <CardContent className="p-6">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm mb-4">
              <strong>Penting:</strong> Buka link dari email di browser yang sama ini.
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tidak menerima email? Pastikan alamat email benar dan coba lagi.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
              >
                Coba Lagi
              </Button>
              <Button variant="gradient" className="flex-1" asChild>
                <Link href="/login">
                  Kembali ke Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Lupa Password?</h1>
        <p className="text-muted-foreground">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
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
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="email@contoh.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Mengirim...
                </>
              ) : (
                "Kirim Link Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link href="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke halaman login
        </Link>
      </p>
    </div>
  );
}
