"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Flag, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Loader2,
  RefreshCw,
  X,
  Search,
  Ban,
} from "lucide-react";

interface Report {
  id: string;
  reporter_id: string | null;
  reported_type: string;
  reported_id: string;
  reason: string;
  description: string | null;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  reporter?: {
    username: string;
    full_name: string | null;
  };
}

const typeLabels: Record<string, { label: string; class: string }> = {
  cheating: { label: "Kecurangan", class: "bg-destructive/20 text-destructive" },
  harassment: { label: "Pelecehan", class: "bg-orange-500/20 text-orange-500" },
  spam: { label: "Spam", class: "bg-muted text-muted-foreground" },
  inappropriate: { label: "Konten Tidak Pantas", class: "bg-warning/20 text-warning" },
  other: { label: "Lainnya", class: "bg-muted text-muted-foreground" },
  user: { label: "Pengguna", class: "bg-primary/20 text-primary" },
  post: { label: "Postingan", class: "bg-secondary/20 text-secondary" },
  comment: { label: "Komentar", class: "bg-accent/20 text-accent" },
  team: { label: "Tim", class: "bg-orange-500/20 text-orange-500" },
};

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-warning/20 text-warning" },
  reviewed: { label: "Direview", class: "bg-primary/20 text-primary" },
  resolved: { label: "Selesai", class: "bg-accent/20 text-accent" },
  dismissed: { label: "Ditolak", class: "bg-muted text-muted-foreground" },
};

export default function ReportsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    resolved: 0,
    banned: 0,
  });
  
  // Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchReports = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("reports")
      .select(`
        *,
        reporter:profiles!reporter_id (
          username,
          full_name
        )
      `)
      .order("created_at", { ascending: false });
    
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    if (search) {
      query = query.or(`reason.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setReports(data);
    }
    
    // Fetch stats
    const [pending, resolved] = await Promise.all([
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "resolved"),
    ]);
    
    // Count banned users
    const { count: bannedCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "banned");
    
    setStats({
      pending: pending.count || 0,
      resolved: resolved.count || 0,
      banned: bannedCount || 0,
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [supabase, statusFilter, search]);

  const handleResolve = async (status: "resolved" | "dismissed") => {
    if (!supabase || !selectedReport || !user) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from("reports")
      .update({
        status: status,
        resolved_by: user.id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", selectedReport.id);
    
    if (!error) {
      setSuccess(status === "resolved" ? "Laporan diselesaikan" : "Laporan ditolak");
      setShowReviewModal(false);
      fetchReports();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const handleBanUser = async () => {
    if (!supabase || !selectedReport) return;
    
    setIsSubmitting(true);
    
    // Update reported user status to banned
    if (selectedReport.reported_type === "user") {
      await supabase
        .from("profiles")
        .update({ status: "banned" })
        .eq("id", selectedReport.reported_id);
    }
    
    // Mark report as resolved
    await supabase
      .from("reports")
      .update({
        status: "resolved",
        resolved_by: user?.id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", selectedReport.id);
    
    setSuccess("Pengguna telah dibanned dan laporan diselesaikan");
    setShowReviewModal(false);
    fetchReports();
    setTimeout(() => setSuccess(null), 3000);
    
    setIsSubmitting(false);
  };

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
        actions={
          <Button variant="outline" className="gap-2" onClick={fetchReports}>
            <RefreshCw className="w-4 h-4" />
            Refresh
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

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
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
              <p className="text-2xl font-bold">{stats.resolved}</p>
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
              <p className="text-2xl font-bold">{stats.banned}</p>
              <p className="text-xs text-muted-foreground">User Dibanned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari laporan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Direview</option>
              <option value="resolved">Selesai</option>
              <option value="dismissed">Ditolak</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20">
          <Flag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Tidak ada laporan</h3>
          <p className="text-muted-foreground">
            {search || statusFilter !== "all" ? "Coba ubah filter pencarian" : "Belum ada laporan dari pengguna"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={typeLabels[report.reason.toLowerCase()]?.class || typeLabels[report.reported_type]?.class || typeLabels.other.class}>
                        {typeLabels[report.reason.toLowerCase()]?.label || typeLabels[report.reported_type]?.label || report.reason}
                      </Badge>
                      <Badge className={statusLabels[report.status]?.class}>
                        {statusLabels[report.status]?.label}
                      </Badge>
                    </div>
                    <p className="font-medium mb-2">{report.description || report.reason}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Tipe: <strong>{report.reported_type}</strong></span>
                      {report.reporter && (
                        <span>Pelapor: <strong>@{report.reporter.username}</strong></span>
                      )}
                      <span>{new Date(report.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => {
                        setSelectedReport(report);
                        setShowReviewModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </Button>
                    {report.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-accent"
                          onClick={() => {
                            setSelectedReport(report);
                            handleResolve("resolved");
                          }}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => {
                            setSelectedReport(report);
                            handleResolve("dismissed");
                          }}
                        >
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
      )}

      {/* Review Modal */}
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Detail Laporan</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipe Laporan</p>
                <p className="font-medium">{selectedReport.reported_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alasan</p>
                <p className="font-medium">{selectedReport.reason}</p>
              </div>
              {selectedReport.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Deskripsi</p>
                  <p className="font-medium">{selectedReport.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={statusLabels[selectedReport.status]?.class}>
                  {statusLabels[selectedReport.status]?.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Laporan</p>
                <p className="font-medium">
                  {new Date(selectedReport.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {selectedReport.status === "pending" && (
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleResolve("dismissed")}
                  disabled={isSubmitting}
                >
                  Tolak
                </Button>
                <Button 
                  variant="gradient" 
                  className="flex-1"
                  onClick={() => handleResolve("resolved")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Selesaikan"}
                </Button>
                {selectedReport.reported_type === "user" && (
                  <Button 
                    variant="destructive"
                    className="gap-2"
                    onClick={handleBanUser}
                    disabled={isSubmitting}
                  >
                    <Ban className="w-4 h-4" />
                    Ban User
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
