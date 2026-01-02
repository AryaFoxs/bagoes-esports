"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const backups = [
  { id: "1", name: "backup_2026-01-10.zip", size: "245 MB", date: "2026-01-10 08:00", status: "completed" },
  { id: "2", name: "backup_2026-01-03.zip", size: "238 MB", date: "2026-01-03 08:00", status: "completed" },
  { id: "3", name: "backup_2025-12-27.zip", size: "232 MB", date: "2025-12-27 08:00", status: "completed" },
];

const systemInfo = {
  version: "1.0.0",
  lastUpdate: "2026-01-05",
  phpVersion: "8.2.0",
  nodeVersion: "20.10.0",
  dbSize: "1.2 GB",
  storageUsed: "4.5 GB",
  storageTotal: "50 GB",
};

export default function MaintenancePage() {
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    await new Promise((res) => setTimeout(res, 2000));
    setIsBackingUp(false);
    alert("Backup berhasil dibuat!");
  };

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
          <Button
            variant="gradient"
            className="gap-2"
            onClick={handleBackup}
            disabled={isBackingUp}
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Membuat Backup...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Buat Backup
              </>
            )}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Backup History */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Riwayat Backup</h3>
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
                          {backup.size} • {backup.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent/20 text-accent">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Berhasil
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Restore */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Restore Backup</h3>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">Upload file backup</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag & drop atau klik untuk memilih file
                </p>
                <Button variant="outline">Pilih File</Button>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30">
                <div className="flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                  <p className="text-sm text-warning">
                    Restore akan mengganti semua data yang ada. Pastikan Anda
                    sudah membuat backup sebelum melakukan restore.
                  </p>
                </div>
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
                  <span className="text-muted-foreground">Ukuran Database</span>
                  <span className="font-medium">{systemInfo.dbSize}</span>
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
                  <span>{systemInfo.storageUsed} digunakan</span>
                  <span className="text-muted-foreground">
                    dari {systemInfo.storageTotal}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: "9%" }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">9% terpakai</p>
            </CardContent>
          </Card>

          {/* Auto Backup */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Backup Otomatis</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">Status</span>
                <Badge className="bg-accent/20 text-accent">Aktif</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Setiap Minggu, 08:00 WIB
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
