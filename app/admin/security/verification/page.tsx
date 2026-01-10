"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  RefreshCw,
  X,
  Search,
  User,
  FileCheck,
  AlertCircle,
} from "lucide-react";

interface VerificationRequest {
  id: string;
  user_id: string;
  type: "identity" | "pro_player" | "team_owner" | "content_creator";
  status: "pending" | "approved" | "rejected";
  documents: string[] | null;
  notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  user?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const typeLabels: Record<string, { label: string; class: string }> = {
  identity: { label: "Identitas", class: "bg-primary/20 text-primary" },
  pro_player: { label: "Pro Player", class: "bg-accent/20 text-accent" },
  team_owner: { label: "Pemilik Tim", class: "bg-secondary/20 text-secondary" },
  content_creator: { label: "Content Creator", class: "bg-orange-500/20 text-orange-500" },
};

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: "Menunggu", class: "bg-warning/20 text-warning" },
  approved: { label: "Disetujui", class: "bg-accent/20 text-accent" },
  rejected: { label: "Ditolak", class: "bg-destructive/20 text-destructive" },
};

export default function VerificationPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  
  // Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");

  const fetchRequests = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("verification_requests")
      .select(`
        *,
        user:profiles!user_id (
          username,
          full_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });
    
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      // Filter by search if provided
      const filtered = search
        ? data.filter((r: VerificationRequest) => 
            r.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
            r.user?.full_name?.toLowerCase().includes(search.toLowerCase())
          )
        : data;
      setRequests(filtered);
    }
    
    // Fetch stats
    const [pending, approved, rejected] = await Promise.all([
      supabase.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    ]);
    
    setStats({
      pending: pending.count || 0,
      approved: approved.count || 0,
      rejected: rejected.count || 0,
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [supabase, statusFilter, search]);

  const handleApprove = async () => {
    if (!supabase || !selectedRequest || !user) return;
    
    setIsSubmitting(true);
    
    // Update verification request
    const { error } = await supabase
      .from("verification_requests")
      .update({
        status: "approved",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", selectedRequest.id);
    
    if (!error) {
      // Update user profile with verified badge
      await supabase
        .from("profiles")
        .update({ 
          is_verified: true,
          verification_type: selectedRequest.type,
        })
        .eq("id", selectedRequest.user_id);
      
      setSuccess("Verifikasi disetujui!");
      setShowReviewModal(false);
      fetchRequests();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!supabase || !selectedRequest || !user) return;
    
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from("verification_requests")
      .update({
        status: "rejected",
        notes: rejectNotes || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", selectedRequest.id);
    
    if (!error) {
      setSuccess("Verifikasi ditolak");
      setShowReviewModal(false);
      setRejectNotes("");
      fetchRequests();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div>
      <PageHeader
        title="Verifikasi Akun"
        description="Kelola permintaan verifikasi pengguna"
        icon={ShieldCheck}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Keamanan", href: "/admin/security" },
          { label: "Verifikasi" },
        ]}
        actions={
          <Button variant="outline" className="gap-2" onClick={fetchRequests}>
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
              <Clock className="w-5 h-5 text-warning" />
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
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">Disetujui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rejected}</p>
              <p className="text-xs text-muted-foreground">Ditolak</p>
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
                placeholder="Cari pengguna..."
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
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Verification Requests */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20">
          <ShieldCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Tidak ada permintaan verifikasi</h3>
          <p className="text-muted-foreground">
            {search || statusFilter !== "all" ? "Coba ubah filter pencarian" : "Belum ada permintaan verifikasi baru"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {request.user?.avatar_url ? (
                        <img src={request.user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">{request.user?.full_name || request.user?.username || "Unknown"}</p>
                        <Badge className={typeLabels[request.type]?.class}>
                          {typeLabels[request.type]?.label}
                        </Badge>
                        <Badge className={statusLabels[request.status]?.class}>
                          {statusLabels[request.status]?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{request.user?.username} • {new Date(request.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowReviewModal(true);
                      }}
                    >
                      <FileCheck className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-accent"
                          onClick={() => {
                            setSelectedRequest(request);
                            handleApprove();
                          }}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowReviewModal(true);
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
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Review Verifikasi</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {selectedRequest.user?.avatar_url ? (
                    <img src={selectedRequest.user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedRequest.user?.full_name || selectedRequest.user?.username}</p>
                  <p className="text-muted-foreground">@{selectedRequest.user?.username}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Tipe Verifikasi</p>
                <Badge className={typeLabels[selectedRequest.type]?.class}>
                  {typeLabels[selectedRequest.type]?.label}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={statusLabels[selectedRequest.status]?.class}>
                  {statusLabels[selectedRequest.status]?.label}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pengajuan</p>
                <p className="font-medium">{new Date(selectedRequest.created_at).toLocaleString("id-ID")}</p>
              </div>
              
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dokumen</p>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc, i) => (
                      <a 
                        key={i} 
                        href={doc} 
                        target="_blank" 
                        className="flex items-center gap-2 p-2 rounded bg-muted hover:bg-muted/80"
                      >
                        <FileCheck className="w-4 h-4" />
                        Dokumen {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Catatan Penolakan (opsional)</p>
                  <Input
                    placeholder="Alasan penolakan jika ditolak..."
                    value={rejectNotes}
                    onChange={(e) => setRejectNotes(e.target.value)}
                  />
                </div>
              )}

              {selectedRequest.notes && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Catatan Penolakan</p>
                      <p className="text-sm">{selectedRequest.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedRequest.status === "pending" && (
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleReject}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tolak"}
                </Button>
                <Button 
                  variant="gradient" 
                  className="flex-1"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Setujui"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
