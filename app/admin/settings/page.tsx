"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { Settings, Save, Upload, Globe, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Bagoes Esports",
    tagline: "Platform Esports Terbesar di Indonesia",
    email: "info@bagoesesports.id",
    phone: "+62 812-3456-7890",
    address: "Jakarta, Indonesia",
    description: "Platform esports terbaik untuk komunitas gaming Indonesia...",
  });

  const handleSave = () => {
    // Save settings
    alert("Settings saved!");
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
          <Button variant="gradient" className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
        }
      />

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
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
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
                  <div className="h-24 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-muted-foreground">Logo Preview</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Favicon</p>
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground">32x32</span>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href="/admin/settings/social">
                    <Globe className="w-4 h-4" />
                    Social Media
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href="/admin/settings/notifications">
                    <Mail className="w-4 h-4" />
                    Notifikasi
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href="/admin/maintenance">
                    <Shield className="w-4 h-4" />
                    Keamanan
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
