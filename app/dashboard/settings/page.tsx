"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Settings,
  Bell,
  Shield,
  Eye,
  Save,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";

interface UserSettings {
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  eventReminders: boolean;
  teamUpdates: boolean;
  forumReplies: boolean;
  newsletter: boolean;
  // Privacy
  profilePublic: boolean;
  showOnlineStatus: boolean;
  showStats: boolean;
  // Security
  twoFactor: boolean;
}

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    teamUpdates: true,
    forumReplies: true,
    newsletter: false,
    profilePublic: true,
    showOnlineStatus: true,
    showStats: true,
    twoFactor: false,
  });

  const fetchSettings = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    if (!error && data) {
      setSettings({
        emailNotifications: data.email_notifications ?? true,
        pushNotifications: data.push_notifications ?? true,
        eventReminders: data.event_reminders ?? true,
        teamUpdates: data.team_updates ?? true,
        forumReplies: data.forum_replies ?? true,
        newsletter: data.newsletter ?? false,
        profilePublic: data.profile_public ?? true,
        showOnlineStatus: data.show_online_status ?? true,
        showStats: data.show_stats ?? true,
        twoFactor: data.two_factor ?? false,
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [supabase, user]);

  const handleSave = async () => {
    if (!supabase || !user) return;
    
    setSaving(true);
    setError(null);
    
    const settingsData = {
      user_id: user.id,
      email_notifications: settings.emailNotifications,
      push_notifications: settings.pushNotifications,
      event_reminders: settings.eventReminders,
      team_updates: settings.teamUpdates,
      forum_replies: settings.forumReplies,
      newsletter: settings.newsletter,
      profile_public: settings.profilePublic,
      show_online_status: settings.showOnlineStatus,
      show_stats: settings.showStats,
      two_factor: settings.twoFactor,
    };
    
    const { error } = await supabase
      .from("user_settings")
      .upsert(settingsData, { onConflict: "user_id" });
    
    if (error) {
      setError("Gagal menyimpan pengaturan");
    } else {
      setSuccess("Pengaturan berhasil disimpan!");
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!supabase || !user) return;
    
    // In a real app, you would have more security checks here
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    
    if (!error) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
    </label>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Pengaturan</h1>
            <p className="text-muted-foreground">Kelola preferensi akun Anda</p>
          </div>
        </div>
        <Button 
          variant="gradient" 
          className="gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Simpan
        </Button>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifikasi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifikasi Email</p>
                      <p className="text-sm text-muted-foreground">Terima notifikasi via email</p>
                    </div>
                    <Toggle 
                      checked={settings.emailNotifications}
                      onChange={(val) => setSettings({ ...settings, emailNotifications: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Notifikasi browser</p>
                    </div>
                    <Toggle 
                      checked={settings.pushNotifications}
                      onChange={(val) => setSettings({ ...settings, pushNotifications: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pengingat Event</p>
                      <p className="text-sm text-muted-foreground">Pengingat sebelum event dimulai</p>
                    </div>
                    <Toggle 
                      checked={settings.eventReminders}
                      onChange={(val) => setSettings({ ...settings, eventReminders: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Update Tim</p>
                      <p className="text-sm text-muted-foreground">Notifikasi aktivitas tim</p>
                    </div>
                    <Toggle 
                      checked={settings.teamUpdates}
                      onChange={(val) => setSettings({ ...settings, teamUpdates: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Balasan Forum</p>
                      <p className="text-sm text-muted-foreground">Notifikasi balasan post</p>
                    </div>
                    <Toggle 
                      checked={settings.forumReplies}
                      onChange={(val) => setSettings({ ...settings, forumReplies: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted-foreground">Berita dan promo mingguan</p>
                    </div>
                    <Toggle 
                      checked={settings.newsletter}
                      onChange={(val) => setSettings({ ...settings, newsletter: val })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Privasi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profil Publik</p>
                      <p className="text-sm text-muted-foreground">Izinkan orang lain melihat profil</p>
                    </div>
                    <Toggle 
                      checked={settings.profilePublic}
                      onChange={(val) => setSettings({ ...settings, profilePublic: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status Online</p>
                      <p className="text-sm text-muted-foreground">Tampilkan status online</p>
                    </div>
                    <Toggle 
                      checked={settings.showOnlineStatus}
                      onChange={(val) => setSettings({ ...settings, showOnlineStatus: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Tampilkan Statistik</p>
                      <p className="text-sm text-muted-foreground">Tampilkan statistik di profil</p>
                    </div>
                    <Toggle 
                      checked={settings.showStats}
                      onChange={(val) => setSettings({ ...settings, showStats: val })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Keamanan
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Two-Factor Auth</p>
                      <p className="text-xs text-muted-foreground">Keamanan tambahan</p>
                    </div>
                    <Badge
                      className={
                        settings.twoFactor
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {settings.twoFactor ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
                  >
                    <Lock className="w-4 h-4" />
                    {settings.twoFactor ? "Nonaktifkan 2FA" : "Aktifkan 2FA"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 text-destructive">Zona Berbahaya</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Aksi ini tidak dapat dibatalkan
                </p>
                
                {showDeleteConfirm ? (
                  <div className="space-y-3">
                    <p className="text-sm text-destructive">
                      Apakah Anda yakin? Semua data akan dihapus permanen.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Batal
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleDeleteAccount}
                      >
                        Hapus Permanen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Akun
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
