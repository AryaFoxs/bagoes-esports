"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Camera,
  Shield,
  CheckCircle,
  Lock,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Password form states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Form data initialized from profile
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    phone: "",
    location: "",
    bio: "",
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user || !supabase) return;
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          username: formData.username,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        if (error.code === "23505") {
          setSaveError("Username sudah digunakan oleh pengguna lain");
        } else {
          setSaveError(error.message);
        }
      } else {
        setSaveSuccess(true);
        await refreshProfile();
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setSaveError("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original profile values
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
    setSaveError(null);
  };

  const handleChangePassword = async () => {
    if (!supabase) return;
    
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validate
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal 6 karakter");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setPasswordError("Terjadi kesalahan saat mengubah kata sandi");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Silakan login terlebih dahulu</p>
      </div>
    );
  }

  const displayName = profile.full_name || profile.username || "User";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Profil Saya</h1>
            <p className="text-muted-foreground">Kelola informasi profil Anda</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>Profil berhasil diperbarui!</span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{displayName}</h2>
                    {profile.is_verified && (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">@{profile.username}</p>
                  <div className="flex gap-2">
                    <Badge className="bg-primary/20 text-primary">
                      Level {profile.level || 1}
                    </Badge>
                    <Badge className="bg-accent/20 text-accent">
                      {profile.rank || "Bronze"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="gap-2"
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4" />
                        Batal
                      </Button>
                      <Button
                        variant="gradient"
                        onClick={handleSave}
                        className="gap-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Simpan
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {saveError && (
                <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span>{saveError}</span>
                  </div>
                </div>
              )}

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nama Lengkap
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        placeholder="Nama lengkap Anda"
                      />
                    ) : (
                      <p className="p-3 rounded-lg bg-muted/50">
                        {profile.full_name || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="username"
                      />
                    ) : (
                      <p className="p-3 rounded-lg bg-muted/50">
                        @{profile.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <p className="p-3 rounded-lg bg-muted/50 text-muted-foreground">
                      {user.email}
                      <span className="ml-2 text-xs">(tidak dapat diubah)</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Telepon
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+62 xxx-xxxx-xxxx"
                      />
                    ) : (
                      <p className="p-3 rounded-lg bg-muted/50">
                        {profile.phone || "-"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Lokasi
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Kota, Negara"
                    />
                  ) : (
                    <p className="p-3 rounded-lg bg-muted/50">
                      {profile.location || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="min-h-[100px]"
                      placeholder="Ceritakan tentang diri Anda..."
                    />
                  ) : (
                    <p className="p-3 rounded-lg bg-muted/50">
                      {profile.bio || "-"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Ubah Kata Sandi
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setPasswordError(null);
                    setPasswordSuccess(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  {showPasswordForm ? "Batal" : "Ubah"}
                </Button>
              </div>

              {showPasswordForm && (
                <div className="space-y-4">
                  {passwordError && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{passwordError}</span>
                      </div>
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                      <div className="flex items-center gap-2 text-accent text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Kata sandi berhasil diubah!</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kata Sandi Baru
                    </label>
                    <Input 
                      type="password" 
                      placeholder="Minimal 6 karakter"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Konfirmasi Kata Sandi
                    </label>
                    <Input 
                      type="password" 
                      placeholder="Ulangi kata sandi baru"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button 
                    variant="gradient" 
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Kata Sandi"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Verifikasi Akun
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  <Badge className="bg-accent/20 text-accent">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Terverifikasi
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Telepon</span>
                  {profile.phone ? (
                    <Badge className="bg-accent/20 text-accent">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Terverifikasi
                    </Badge>
                  ) : (
                    <Badge className="bg-muted text-muted-foreground">
                      Belum Verifikasi
                    </Badge>
                  )}
                </div>
              </div>
              {!profile.phone && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setIsEditing(true)}
                >
                  Tambah Telepon
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Informasi Akun</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bergabung</span>
                  <span>
                    {new Date(profile.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-bold">{profile.level || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">XP</span>
                  <span className="font-bold">{profile.xp || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rank</span>
                  <Badge className="bg-accent/20 text-accent">
                    {profile.rank || "Bronze"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <Badge className="bg-primary/20 text-primary capitalize">
                    {profile.role || "user"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
