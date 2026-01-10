"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bell, 
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  Trophy,
  Shield,
  Users,
} from "lucide-react";

interface NotificationSettings {
  id?: string;
  email_new_user: boolean;
  email_new_event: boolean;
  email_event_registration: boolean;
  email_new_report: boolean;
  email_verification_request: boolean;
  push_enabled: boolean;
  push_new_registration: boolean;
  push_event_start: boolean;
  discord_webhook: string;
  discord_enabled: boolean;
}

const defaultSettings: NotificationSettings = {
  email_new_user: true,
  email_new_event: true,
  email_event_registration: true,
  email_new_report: true,
  email_verification_request: true,
  push_enabled: false,
  push_new_registration: false,
  push_event_start: false,
  discord_webhook: "",
  discord_enabled: false,
};

export default function NotificationsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("notification_settings")
      .select("*")
      .single();
    
    if (!error && data) {
      setSettings(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, [supabase]);

  const handleSave = async () => {
    if (!supabase) return;
    
    setSaving(true);
    setError(null);
    
    const { data: existing } = await supabase
      .from("notification_settings")
      .select("id")
      .single();
    
    let error;
    
    if (existing?.id) {
      const result = await supabase
        .from("notification_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("notification_settings")
        .insert(settings);
      error = result.error;
    }
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Pengaturan notifikasi berhasil disimpan!");
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setSaving(false);
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        enabled ? "bg-accent" : "bg-muted"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
          enabled ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  );

  return (
    <div>
      <PageHeader
        title="Pengaturan Notifikasi"
        description="Kelola notifikasi email dan push"
        icon={Bell}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pengaturan", href: "/admin/settings" },
          { label: "Notifikasi" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        }
      />

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
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
        <div className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Notifikasi Email</h3>
                  <p className="text-sm text-muted-foreground">Notifikasi yang dikirim ke email admin</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Pengguna Baru</p>
                      <p className="text-xs text-muted-foreground">Notifikasi saat ada user baru mendaftar</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.email_new_user} 
                    onToggle={() => toggleSetting("email_new_user")} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Event Baru</p>
                      <p className="text-xs text-muted-foreground">Notifikasi saat event baru dibuat</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.email_new_event} 
                    onToggle={() => toggleSetting("email_new_event")} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Pendaftaran Event</p>
                      <p className="text-xs text-muted-foreground">Notifikasi saat ada pendaftaran event baru</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.email_event_registration} 
                    onToggle={() => toggleSetting("email_event_registration")} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Laporan Baru</p>
                      <p className="text-xs text-muted-foreground">Notifikasi saat ada laporan pelanggaran</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.email_new_report} 
                    onToggle={() => toggleSetting("email_new_report")} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Permintaan Verifikasi</p>
                      <p className="text-xs text-muted-foreground">Notifikasi saat ada permintaan verifikasi akun</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.email_verification_request} 
                    onToggle={() => toggleSetting("email_verification_request")} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Notifikasi browser dan mobile</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Aktifkan Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Aktifkan notifikasi push ke browser</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.push_enabled} 
                    onToggle={() => toggleSetting("push_enabled")} 
                  />
                </div>
                
                {settings.push_enabled && (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Pendaftaran Baru</p>
                          <p className="text-xs text-muted-foreground">Push saat ada pendaftaran event</p>
                        </div>
                      </div>
                      <ToggleSwitch 
                        enabled={settings.push_new_registration} 
                        onToggle={() => toggleSetting("push_new_registration")} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Event Dimulai</p>
                          <p className="text-xs text-muted-foreground">Push saat event akan dimulai</p>
                        </div>
                      </div>
                      <ToggleSwitch 
                        enabled={settings.push_event_start} 
                        onToggle={() => toggleSetting("push_event_start")} 
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Discord Webhook */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-bold">Discord Integration</h3>
                  <p className="text-sm text-muted-foreground">Kirim notifikasi ke channel Discord</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Aktifkan Discord Webhook</p>
                      <p className="text-xs text-muted-foreground">Kirim notifikasi ke Discord</p>
                    </div>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.discord_enabled} 
                    onToggle={() => toggleSetting("discord_enabled")} 
                  />
                </div>
                
                {settings.discord_enabled && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Webhook URL</label>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      value={settings.discord_webhook}
                      onChange={(e) => setSettings({ ...settings, discord_webhook: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Masukkan URL webhook dari Discord server Anda
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
