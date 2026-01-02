"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bell,
  Shield,
  Eye,
  Smartphone,
  Globe,
  Save,
  LogOut,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    teamUpdates: true,
    forumReplies: true,
    newsletter: false,
    // Privacy
    profilePublic: true,
    showOnlineStatus: true,
    showStats: true,
    // Security
    twoFactor: false,
  });

  const devices = [
    { id: "1", name: "Chrome - Windows", location: "Jakarta", lastActive: "Sekarang", current: true },
    { id: "2", name: "Safari - iPhone", location: "Jakarta", lastActive: "2 jam lalu", current: false },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Pengaturan</h1>
            <p className="text-muted-foreground">Kelola preferensi akun Anda</p>
          </div>
        </div>
        <Button variant="gradient" className="gap-2">
          <Save className="w-4 h-4" />
          Simpan
        </Button>
      </div>

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
                {[
                  { key: "emailNotifications", label: "Notifikasi Email", desc: "Terima notifikasi via email" },
                  { key: "pushNotifications", label: "Push Notifications", desc: "Notifikasi browser" },
                  { key: "eventReminders", label: "Pengingat Event", desc: "Pengingat sebelum event dimulai" },
                  { key: "teamUpdates", label: "Update Tim", desc: "Notifikasi aktivitas tim" },
                  { key: "forumReplies", label: "Balasan Forum", desc: "Notifikasi balasan post" },
                  { key: "newsletter", label: "Newsletter", desc: "Berita dan promo mingguan" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onChange={(e) =>
                          setSettings({ ...settings, [item.key]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
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
                {[
                  { key: "profilePublic", label: "Profil Publik", desc: "Izinkan orang lain melihat profil" },
                  { key: "showOnlineStatus", label: "Status Online", desc: "Tampilkan status online" },
                  { key: "showStats", label: "Tampilkan Statistik", desc: "Tampilkan statistik di profil" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onChange={(e) =>
                          setSettings({ ...settings, [item.key]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Devices */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Perangkat Terhubung
              </h3>
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{device.name}</p>
                          {device.current && (
                            <Badge className="bg-accent/20 text-accent text-xs">
                              Saat Ini
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {device.location} • {device.lastActive}
                        </p>
                      </div>
                    </div>
                    {!device.current && (
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
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
                <Button variant="outline" className="w-full">
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
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Akun
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
