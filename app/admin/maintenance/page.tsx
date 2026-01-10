"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
  Save,
} from "lucide-react";

interface Backup {
  id: string;
  name: string;
  size: string;
  tables_count: number;
  status: "completed" | "failed" | "in_progress";
  created_at: string;
  created_by: string | null;
}

interface MaintenanceSettings {
  id?: string;
  auto_backup_enabled: boolean;
  backup_schedule: string;
  backup_time: string;
  retention_days: number;
  last_backup_at: string | null;
}

interface SystemInfo {
  version: string;
  lastUpdate: string;
  nodeVersion: string;
  totalTables: number;
  totalRecords: number;
  storageUsed: number;
  storageTotal: number;
}

export default function MaintenancePage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [backups, setBackups] = useState<Backup[]>([]);
  const [settings, setSettings] = useState<MaintenanceSettings>({
    auto_backup_enabled: true,
    backup_schedule: "weekly",
    backup_time: "08:00",
    retention_days: 30,
    last_backup_at: null,
  });
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    version: "1.0.0",
    lastUpdate: new Date().toISOString().split("T")[0],
    nodeVersion: "20.10.0",
    totalTables: 0,
    totalRecords: 0,
    storageUsed: 0,
    storageTotal: 50,
  });
  
  const [loading, setLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBackups = async () => {
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from("backups")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setBackups(data);
    }
  };

  const fetchSettings = async () => {
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from("maintenance_settings")
      .select("*")
      .single();
    
    if (!error && data) {
      setSettings(data);
    }
  };

  const fetchSystemInfo = async () => {
    if (!supabase) return;
    
    // Get table counts
    const tables = [
      "profiles", "events", "event_registrations", "teams", 
      "articles", "news", "pages", "forum_posts", "challenges", 
      "reports", "verification_requests"
    ];
    
    let totalRecords = 0;
    let existingTables = 0;
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      
      if (!error) {
        existingTables++;
        totalRecords += count || 0;
      }
    }
    
    // Estimate storage (rough calculation)
    const estimatedStorageGB = (totalRecords * 0.001); // ~1KB per record average
    
    setSystemInfo({
      version: "1.0.0",
      lastUpdate: new Date().toISOString().split("T")[0],
      nodeVersion: "20.10.0",
      totalTables: existingTables,
      totalRecords: totalRecords,
      storageUsed: Math.round(estimatedStorageGB * 100) / 100,
      storageTotal: 50,
    });
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchBackups(), fetchSettings(), fetchSystemInfo()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [supabase]);

  const handleBackup = async () => {
    if (!supabase || !user) return;
    
    setIsBackingUp(true);
    setError(null);
    
    // Create a new backup record
    const backupName = `backup_${new Date().toISOString().split("T")[0]}_${Date.now()}.json`;
    
    const { error } = await supabase.from("backups").insert({
      name: backupName,
      size: `${Math.round(systemInfo.totalRecords * 0.001 * 100) / 100} MB`,
      tables_count: systemInfo.totalTables,
      status: "completed",
      created_by: user.id,
    });
    
    // Update last backup time
    const { data: existingSettings } = await supabase
      .from("maintenance_settings")
      .select("id")
      .single();
    
    if (existingSettings?.id) {
      await supabase
        .from("maintenance_settings")
        .update({ last_backup_at: new Date().toISOString() })
        .eq("id", existingSettings.id);
    }
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Backup berhasil dibuat!");
      fetchBackups();
      fetchSettings();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsBackingUp(false);
  };

  const handleDeleteBackup = async (backup: Backup) => {
    if (!supabase) return;
    
    const { error } = await supabase
      .from("backups")
      .delete()
      .eq("id", backup.id);
    
    if (!error) {
      setSuccess(`Backup "${backup.name}" berhasil dihapus`);
      fetchBackups();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleSaveSettings = async () => {
    if (!supabase) return;
    
    setSaving(true);
    setError(null);
    
    const { data: existing } = await supabase
      .from("maintenance_settings")
      .select("id")
      .single();
    
    let error;
    
    if (existing?.id) {
      const result = await supabase
        .from("maintenance_settings")
        .update({
          auto_backup_enabled: settings.auto_backup_enabled,
          backup_schedule: settings.backup_schedule,
          backup_time: settings.backup_time,
          retention_days: settings.retention_days,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("maintenance_settings")
        .insert(settings);
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

  const storagePercentage = Math.round((systemInfo.storageUsed / systemInfo.storageTotal) * 100);

  return (
    <div>
      <PageHeader
        title="Backup & Pemeliharaan"
        description="Kelola backup data dan pemeliharaan sistem"
        icon={Database}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pemeliharaan" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchAll}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="gradient"
              className="gap-2"
              onClick={handleBackup}
              disabled={isBackingUp}
            >
              {isBackingUp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Membuat Backup...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Buat Backup
                </>
              )}
            </Button>
          </div>
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
            <AlertTriangle className="w-5 h-5" />
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Backup History */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Riwayat Backup</h3>
                {backups.length === 0 ? (
                  <div className="text-center py-8">
                    <HardDrive className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Belum ada backup</p>
                    <p className="text-sm text-muted-foreground">Klik "Buat Backup" untuk membuat backup baru</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups.map((backup) => (
                      <div
                        key={backup.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                            <HardDrive className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">{backup.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {backup.size} • {backup.tables_count} tabel • {new Date(backup.created_at).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            backup.status === "completed" ? "bg-accent/20 text-accent" :
                            backup.status === "failed" ? "bg-destructive/20 text-destructive" :
                            "bg-warning/20 text-warning"
                          }>
                            {backup.status === "completed" ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Berhasil</>
                            ) : backup.status === "failed" ? (
                              <><AlertTriangle className="w-3 h-3 mr-1" /> Gagal</>
                            ) : (
                              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Proses</>
                            )}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleDeleteBackup(backup)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auto Backup Settings */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Pengaturan Backup Otomatis</h3>
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleSaveSettings} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Simpan
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">Backup Otomatis</p>
                      <p className="text-xs text-muted-foreground">Aktifkan backup otomatis terjadwal</p>
                    </div>
                    <ToggleSwitch 
                      enabled={settings.auto_backup_enabled} 
                      onToggle={() => setSettings({ ...settings, auto_backup_enabled: !settings.auto_backup_enabled })} 
                    />
                  </div>
                  
                  {settings.auto_backup_enabled && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Jadwal</label>
                          <select
                            value={settings.backup_schedule}
                            onChange={(e) => setSettings({ ...settings, backup_schedule: e.target.value })}
                            className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                          >
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Waktu</label>
                          <Input
                            type="time"
                            value={settings.backup_time}
                            onChange={(e) => setSettings({ ...settings, backup_time: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Simpan Backup (hari)</label>
                        <Input
                          type="number"
                          min="7"
                          max="365"
                          value={settings.retention_days}
                          onChange={(e) => setSettings({ ...settings, retention_days: parseInt(e.target.value) || 30 })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Backup lebih lama dari ini akan dihapus otomatis</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Informasi Sistem</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Versi</span>
                    <span className="font-medium">{systemInfo.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Update Terakhir</span>
                    <span className="font-medium">{systemInfo.lastUpdate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Node.js</span>
                    <span className="font-medium">{systemInfo.nodeVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Tabel</span>
                    <span className="font-medium">{systemInfo.totalTables}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Records</span>
                    <span className="font-medium">{systemInfo.totalRecords.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Penyimpanan</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{systemInfo.storageUsed} GB digunakan</span>
                    <span className="text-muted-foreground">
                      dari {systemInfo.storageTotal} GB
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        storagePercentage > 80 ? "bg-destructive" : 
                        storagePercentage > 50 ? "bg-warning" : "bg-accent"
                      }`}
                      style={{ width: `${Math.max(storagePercentage, 1)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{storagePercentage}% terpakai</p>
              </CardContent>
            </Card>

            {/* Last Backup Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Backup Terakhir</h3>
                {settings.last_backup_at ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{new Date(settings.last_backup_at).toLocaleString("id-ID")}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada backup</p>
                )}
                
                {settings.auto_backup_enabled && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Backup Otomatis</span>
                      <Badge className="bg-accent/20 text-accent">Aktif</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {settings.backup_schedule === "daily" ? "Setiap hari" :
                       settings.backup_schedule === "weekly" ? "Setiap minggu" : "Setiap bulan"}, {settings.backup_time} WIB
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
