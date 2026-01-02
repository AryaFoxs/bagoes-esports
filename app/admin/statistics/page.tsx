"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { BarChart3, Users, Calendar, Trophy, TrendingUp, TrendingDown } from "lucide-react";

const stats = {
  visitors: { value: "45,230", change: 12, label: "Pengunjung Bulan Ini" },
  pageViews: { value: "125,890", change: 8, label: "Total Page Views" },
  eventRegistrations: { value: "1,234", change: 15, label: "Pendaftaran Event" },
  newUsers: { value: "567", change: -3, label: "User Baru" },
};

const topPages = [
  { page: "/", views: 12500, label: "Home" },
  { page: "/event", views: 8900, label: "Event" },
  { page: "/turnamen", views: 7200, label: "Turnamen" },
  { page: "/tim", views: 5400, label: "Tim" },
  { page: "/blog", views: 4100, label: "Blog" },
];

const eventStats = [
  { name: "Valorant Championship", participants: 256, revenue: "Rp 25.600.000" },
  { name: "MLBB Pro League", participants: 128, revenue: "Rp 12.800.000" },
  { name: "PUBG Mobile Cup", participants: 512, revenue: "Rp 51.200.000" },
];

export default function StatisticsPage() {
  return (
    <div>
      <PageHeader
        title="Statistik & Laporan"
        description="Analitik dan performa website"
        icon={BarChart3}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Statistik" },
        ]}
      />

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(stats).map(([key, stat]) => (
          <Card key={key}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold">{stat.value}</p>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.change >= 0 ? "text-accent" : "text-destructive"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic Chart Placeholder */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Traffic Overview</h3>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Chart akan ditampilkan di sini
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Halaman Terpopuler</h3>
            <div className="space-y-3">
              {topPages.map((page, i) => (
                <div
                  key={page.page}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{page.label}</p>
                      <p className="text-xs text-muted-foreground">{page.page}</p>
                    </div>
                  </div>
                  <span className="font-bold">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Statistics */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Statistik Event</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 text-left text-sm font-semibold">Event</th>
                    <th className="py-3 text-center text-sm font-semibold">Peserta</th>
                    <th className="py-3 text-right text-sm font-semibold">Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {eventStats.map((event) => (
                    <tr key={event.name} className="border-b border-border">
                      <td className="py-3 font-medium">{event.name}</td>
                      <td className="py-3 text-center">{event.participants}</td>
                      <td className="py-3 text-right text-accent font-medium">
                        {event.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td className="py-3">Total</td>
                    <td className="py-3 text-center">896</td>
                    <td className="py-3 text-right text-accent">Rp 89.600.000</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
