"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Settings, 
  Save, 
  Upload, 
  Globe, 
  Mail, 
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface SiteSettings {
  id?: string;
  site_name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  logo_url: string | null;
  favicon_url: string | null;
}

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "Bagoes Esports",
    tagline: "Platform Esports Terbesar di Indonesia",
    description: "Platform esports terbaik untuk komunitas gaming Indonesia...",
    email: "info@bagoesesports.id",
    phone: "+62 812-3456-7890",
    address: "Jakarta, Indonesia",
    logo_url: null,
    favicon_url: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("site_settings")
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
      .from("site_settings")
      .select("id")
      .single();
    
    let error;
    
    if (existing?.id) {
      // Update existing
      const result = await supabase
        .from("site_settings")
        .update({
          site_name: settings.site_name,
          tagline: settings.tagline,
          description: settings.description,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          logo_url: settings.logo_url,
          favicon_url: settings.favicon_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      error = result.error;
    } else {
      // Insert new
      const result = await supabase
        .from("site_settings")
        .insert({
          site_name: settings.site_name,
          tagline: settings.tagline,
          description: settings.description,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          logo_url: settings.logo_url,
          favicon_url: settings.favicon_url,
        });
      error = result.error;
    }
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Pengaturan berhasil disimpan!");
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setSaving(false);
  };

  return (
    <div>
      <PageHeader
        title="Pengaturan Website"
        description="Konfigurasi umum website"
        icon={Settings}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pengaturan" },
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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Informasi Umum
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nama Website</label>
                    <Input
                      value={settings.site_name}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <Input
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Deskripsi</label>
                    <Textarea
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Kontak
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telepon</label>
                    <Input
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Alamat</label>
                    <Input
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Logo & Favicon</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Logo Website</p>
                    <div className="h-24 bg-muted rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                      {settings.logo_url ? (
                        <img src={settings.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-muted-foreground">Logo Preview</span>
                      )}
                    </div>
                    <Input
                      placeholder="URL Logo"
                      value={settings.logo_url || ""}
                      onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                      className="mb-2"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Favicon</p>
                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                      {settings.favicon_url ? (
                        <img src={settings.favicon_url} alt="Favicon" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-xs text-muted-foreground">32x32</span>
                      )}
                    </div>
                    <Input
                      placeholder="URL Favicon"
                      value={settings.favicon_url || ""}
                      onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/admin/settings/social">
                      <Globe className="w-4 h-4" />
                      Social Media
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/admin/settings/notifications">
                      <Mail className="w-4 h-4" />
                      Notifikasi
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <Link href="/admin/maintenance">
                      <Shield className="w-4 h-4" />
                      Pemeliharaan
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
