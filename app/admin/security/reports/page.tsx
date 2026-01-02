"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Shield, Flag, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";

const reports = [
  {
    id: "1",
    type: "cheating",
    reporter: "JohnDoe",
    reported: "HackerX",
    reason: "Menggunakan cheat dalam turnamen",
    status: "pending",
    date: "2026-01-10",
  },
  {
    id: "2",
    type: "harassment",
    reporter: "GamerGirl",
    reported: "ToxicPlayer",
    reason: "Pelecehan verbal di forum",
    status: "pending",
    date: "2026-01-09",
  },
  {
    id: "3",
    type: "spam",
    reporter: "Admin",
    reported: "SpamBot",
    reason: "Posting spam berulang",
    status: "resolved",
    date: "2026-01-08",
  },
];

const typeLabels: Record<string, { label: string; class: string }> = {
  cheating: { label: "Kecurangan", class: "bg-destructive/20 text-destructive" },
  harassment: { label: "Pelecehan", class: "bg-warning/20 text-warning" },
  spam: { label: "Spam", class: "bg-muted text-muted-foreground" },
  other: { label: "Lainnya", class: "bg-muted text-muted-foreground" },
};

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = reports.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  return (
    <div>
      <PageHeader
        title="Laporan Pengguna"
        description="Tangani laporan pelanggaran dari pengguna"
        icon={Flag}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Keamanan", href: "/admin/security" },
          { label: "Laporan" },
        ]}
      />

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reports.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-xs text-muted-foreground">Menunggu Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {reports.filter((r) => r.status === "resolved").length}
              </p>
              <p className="text-xs text-muted-foreground">Diselesaikan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">User Dibanned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={typeLabels[report.type].class}>
                      {typeLabels[report.type].label}
                    </Badge>
                    <Badge
                      className={
                        report.status === "pending"
                          ? "bg-warning/20 text-warning"
                          : "bg-accent/20 text-accent"
                      }
                    >
                      {report.status === "pending" ? "Pending" : "Resolved"}
                    </Badge>
                  </div>
                  <p className="font-medium mb-2">{report.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Dilaporkan: <strong>@{report.reported}</strong>
                    </span>
                    <span>
                      Pelapor: <strong>@{report.reporter}</strong>
                    </span>
                    <span>{new Date(report.date).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="w-4 h-4" />
                    Review
                  </Button>
                  {report.status === "pending" && (
                    <>
                      <Button variant="outline" size="sm" className="text-accent">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
