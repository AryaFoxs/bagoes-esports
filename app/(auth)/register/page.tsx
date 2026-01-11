"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function RegisterForm() {
  const router = useRouter();
  const { signUp, signOut } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRequirements = [
    { label: "Minimal 8 karakter", met: formData.password.length >= 8 },
    { label: "Huruf besar", met: /[A-Z]/.test(formData.password) },
    { label: "Huruf kecil", met: /[a-z]/.test(formData.password) },
    { label: "Angka", met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      username: formData.username,
      full_name: `${formData.firstName} ${formData.lastName}`.trim(),
    });

    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }

    // Sign out immediately after registration to prevent auto-login
    await signOut();
    
    router.push("/login?registered=true");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Buat Akun Baru</h1>
        <p className="text-muted-foreground">
          Bergabung dengan komunitas esports terbesar
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Depan
                </label>
                <Input
                  placeholder="Nama"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Belakang
                </label>
                <Input
                  placeholder="Belakang"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="username_kamu"
                  className="pl-10"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="email@contoh.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.label}
                      className={`flex items-center gap-2 text-xs ${
                        req.met ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          req.met ? "opacity-100" : "opacity-30"
                        }`}
                      />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  className={`pl-10 pr-20 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-destructive focus:border-destructive"
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? "border-accent focus:border-accent"
                      : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {formData.confirmPassword && (
                    <>
                      {formData.password === formData.confirmPassword ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <span className="text-destructive text-sm">✕</span>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-destructive mt-1">Password tidak cocok</p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-border accent-primary"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Saya setuju dengan{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-primary hover:underline"
                >
                  Syarat & Ketentuan
                </button>{" "}
                dan{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-primary hover:underline"
                >
                  Kebijakan Privasi
                </button>
              </label>
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
                  Membuat akun...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Daftar
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Atau daftar dengan
              </span>
            </div>
          </div>

          {/* Social Registration */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" className="gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Discord
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Masuk
        </Link>
      </p>

      {/* Terms & Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              📜 Syarat & Ketentuan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Terakhir diperbarui: 1 Januari 2026</p>
            
            <h4 className="font-bold text-foreground">1. Penerimaan Ketentuan</h4>
            <p>
              Dengan mengakses dan menggunakan layanan Bagoes Esports, Anda setuju untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
            </p>
            
            <h4 className="font-bold text-foreground">2. Penggunaan Layanan</h4>
            <p>
              Anda harus berusia minimal 13 tahun untuk menggunakan layanan ini. Anda bertanggung jawab untuk menjaga kerahasiaan akun Anda dan semua aktivitas yang terjadi di bawah akun Anda.
            </p>
            
            <h4 className="font-bold text-foreground">3. Konten Pengguna</h4>
            <p>
              Anda mempertahankan kepemilikan konten yang Anda unggah, namun Anda memberikan kami lisensi untuk menggunakan, menampilkan, dan mendistribusikan konten tersebut di platform kami.
            </p>
            
            <h4 className="font-bold text-foreground">4. Perilaku yang Dilarang</h4>
            <p>
              Dilarang melakukan tindakan yang melanggar hukum, menyebarkan konten berbahaya, melakukan penipuan, atau mengganggu pengguna lain.
            </p>
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/terms">
                  <ExternalLink className="w-4 h-4" />
                  Baca Selengkapnya
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🔒 Kebijakan Privasi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Terakhir diperbarui: 1 Januari 2026</p>
            
            <h4 className="font-bold text-foreground">1. Informasi yang Kami Kumpulkan</h4>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, email, dan informasi profil. Kami juga mengumpulkan data penggunaan secara otomatis.
            </p>
            
            <h4 className="font-bold text-foreground">2. Penggunaan Informasi</h4>
            <p>
              Informasi Anda digunakan untuk menyediakan layanan, mengirim notifikasi, meningkatkan pengalaman pengguna, dan berkomunikasi dengan Anda.
            </p>
            
            <h4 className="font-bold text-foreground">3. Berbagi Informasi</h4>
            <p>
              Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Informasi hanya dibagikan dengan penyedia layanan yang membantu operasional kami.
            </p>
            
            <h4 className="font-bold text-foreground">4. Keamanan Data</h4>
            <p>
              Kami menerapkan langkah-langkah keamanan untuk melindungi informasi pribadi Anda dari akses, perubahan, atau pengungkapan yang tidak sah.
            </p>
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/privacy">
                  <ExternalLink className="w-4 h-4" />
                  Baca Selengkapnya
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RegisterLoading() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}
