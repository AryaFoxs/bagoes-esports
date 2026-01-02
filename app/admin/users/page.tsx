"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Ban,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock users data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    role: "user",
    status: "active",
    joinDate: "2025-01-15",
    lastActive: "2 jam lalu",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    username: "janesmith",
    role: "moderator",
    status: "active",
    joinDate: "2025-02-20",
    lastActive: "5 menit lalu",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    username: "bobjohnson",
    role: "user",
    status: "banned",
    joinDate: "2025-03-10",
    lastActive: "1 minggu lalu",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    username: "alicebrown",
    role: "vip",
    status: "active",
    joinDate: "2025-04-05",
    lastActive: "1 hari lalu",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    username: "charliew",
    role: "admin",
    status: "active",
    joinDate: "2024-12-01",
    lastActive: "online",
  },
];

const roleColors: Record<string, string> = {
  user: "bg-muted text-muted-foreground",
  moderator: "bg-secondary/20 text-secondary",
  admin: "bg-primary/20 text-primary",
  vip: "bg-accent/20 text-accent",
};

const statusColors: Record<string, string> = {
  active: "bg-accent/20 text-accent",
  inactive: "bg-muted text-muted-foreground",
  banned: "bg-destructive/20 text-destructive",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola semua pengguna yang terdaftar di platform"
        icon={Users}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pengguna" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Pengguna
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
              >
                <option value="all">Semua Role</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
                <option value="vip">VIP</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Pengguna
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Bergabung
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Terakhir Aktif
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username} • {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={roleColors[user.role]}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[user.status]}>
                        {user.status === "active"
                          ? "Aktif"
                          : user.status === "inactive"
                          ? "Tidak Aktif"
                          : "Banned"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.joinDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setShowActions(
                              showActions === user.id ? null : user.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {showActions === user.id && (
                          <div className="absolute right-0 top-10 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                            <div className="p-2">
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Lihat Detail
                              </Link>
                              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                                <Shield className="w-4 h-4" />
                                Ubah Role
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-warning hover:bg-warning/10 transition-colors">
                                <Ban className="w-4 h-4" />
                                {user.status === "banned" ? "Unban" : "Ban"}
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Hapus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredUsers.length} dari {users.length} pengguna
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary/10">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
