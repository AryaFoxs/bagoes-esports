"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  Loader2,
  RefreshCw,
  Search,
  Calendar,
} from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string | null;
  amount: number;
  status: "success" | "pending" | "failed" | "refunded";
  payment_method: string | null;
  reference_id: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  success: {
    label: "Berhasil",
    class: "bg-accent/20 text-accent",
    icon: CheckCircle,
  },
  pending: {
    label: "Menunggu",
    class: "bg-warning/20 text-warning",
    icon: Clock,
  },
  failed: {
    label: "Gagal",
    class: "bg-destructive/20 text-destructive",
    icon: XCircle,
  },
  refunded: {
    label: "Dikembalikan",
    class: "bg-secondary/20 text-secondary",
    icon: Receipt,
  },
};

export default function TransactionsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTransactions = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setTransactions(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [supabase, user, statusFilter]);

  const filteredTransactions = transactions.filter(t => 
    !search || 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const successCount = transactions.filter((t) => t.status === "success").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Transaksi</h1>
              <p className="text-muted-foreground">Riwayat pembayaran Anda</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchTransactions}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{transactions.length}</p>
              <p className="text-xs text-muted-foreground">Total Transaksi</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{successCount}</p>
              <p className="text-xs text-muted-foreground">Berhasil</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari transaksi..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="success">Berhasil</option>
              <option value="pending">Menunggu</option>
              <option value="failed">Gagal</option>
              <option value="refunded">Dikembalikan</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Belum ada transaksi</h3>
            <p className="text-muted-foreground">
              {search || statusFilter !== "all" 
                ? "Coba ubah filter pencarian"
                : "Riwayat transaksi Anda akan muncul di sini"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Deskripsi</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Metode</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Jumlah</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((trx) => {
                    const config = statusConfig[trx.status] || statusConfig.pending;
                    const StatusIcon = config.icon;
                    return (
                      <tr
                        key={trx.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-mono">
                          {trx.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{trx.title}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(trx.created_at)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {trx.payment_method || "-"}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatCurrency(trx.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={config.class}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {trx.status === "success" && (
                            <Button variant="ghost" size="sm" title="Download Invoice">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Summary */}
            <div className="p-4 border-t border-border bg-muted/30 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Menampilkan {filteredTransactions.length} transaksi
              </p>
              {pendingCount > 0 && (
                <Badge className="bg-warning/20 text-warning">
                  {pendingCount} transaksi pending
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
