"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
} from "lucide-react";

const transactions = [
  {
    id: "TRX-001",
    type: "event_registration",
    title: "Pendaftaran Valorant Championship",
    amount: "Rp 100.000",
    status: "success",
    date: "2026-01-10",
    method: "GoPay",
  },
  {
    id: "TRX-002",
    type: "event_registration",
    title: "Pendaftaran MLBB Weekend Cup",
    amount: "Rp 50.000",
    status: "pending",
    date: "2026-01-08",
    method: "OVO",
  },
  {
    id: "TRX-003",
    type: "merchandise",
    title: "Jersey Team Phoenix Rising",
    amount: "Rp 350.000",
    status: "success",
    date: "2025-12-20",
    method: "Transfer Bank",
  },
  {
    id: "TRX-004",
    type: "donation",
    title: "Donasi Turnamen Komunitas",
    amount: "Rp 25.000",
    status: "success",
    date: "2025-12-15",
    method: "DANA",
  },
];

const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
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
};

export default function TransactionsPage() {
  const totalSpent = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + parseInt(t.amount.replace(/\D/g, "")), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Transaksi</h1>
            <p className="text-muted-foreground">Riwayat pembayaran Anda</p>
          </div>
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
              <p className="text-2xl font-bold">
                {transactions.filter((t) => t.status === "success").length}
              </p>
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
              <p className="text-2xl font-bold">
                Rp {totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Deskripsi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Metode
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trx) => {
                  const config = statusConfig[trx.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr
                      key={trx.id}
                      className="border-b border-border hover:bg-muted/30"
                    >
                      <td className="px-6 py-4 text-sm font-mono">{trx.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{trx.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(trx.date).toLocaleDateString("id-ID")}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm">{trx.method}</td>
                      <td className="px-6 py-4 font-medium">{trx.amount}</td>
                      <td className="px-6 py-4">
                        <Badge className={config.class}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {trx.status === "success" && (
                          <Button variant="ghost" size="sm">
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
        </CardContent>
      </Card>
    </div>
  );
}
