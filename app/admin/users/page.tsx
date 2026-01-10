"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database.types";
import {
  Users,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Ban,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";

const roleColors: Record<string, string> = {
  user: "bg-muted text-muted-foreground",
  moderator: "bg-secondary/20 text-secondary",
  admin: "bg-primary/20 text-primary",
  superadmin: "bg-accent/20 text-accent",
};

const roleLabels: Record<string, string> = {
  user: "User",
  moderator: "Moderator",
  admin: "Admin",
  superadmin: "Super Admin",
};

export default function UsersPage() {
  const supabase = useMemo(() => createClient(), []);
  
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showActions, setShowActions] = useState<string | null>(null);
  
  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" });
    
    // Apply role filter
    if (roleFilter !== "all") {
      query = query.eq("role", roleFilter);
    }
    
    // Apply search filter
    if (search) {
      query = query.or(`username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    // Apply pagination
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    query = query.range(from, to);
    
    // Order by created_at
    query = query.order("created_at", { ascending: false });
    
    const { data, error, count } = await query;
    
    if (!error && data) {
      setUsers(data);
      setTotalCount(count || 0);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [supabase, roleFilter, search, currentPage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking on the dropdown or action button
      if (target.closest('[data-dropdown]') || target.closest('[data-action-btn]')) {
        return;
      }
      setShowActions(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole || !supabase) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", selectedUser.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Role ${selectedUser.username} berhasil diubah menjadi ${roleLabels[newRole]}`);
      setShowRoleModal(false);
      fetchUsers();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !supabase) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    // Note: This only deletes the profile, not the auth user
    // For full deletion, you'd need a Supabase Edge Function with admin privileges
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", selectedUser.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Pengguna ${selectedUser.username} berhasil dihapus`);
      setShowDeleteModal(false);
      fetchUsers();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const openRoleModal = (user: Profile) => {
    setSelectedUser(user);
    setNewRole(user.role || "user");
    setShowRoleModal(true);
    setShowActions(null);
  };

  const openDeleteModal = (user: Profile) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setShowActions(null);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID");
  };

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
          <Button variant="outline" className="gap-2" onClick={fetchUsers}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      {/* Success Message */}
      {updateSuccess && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>{updateSuccess}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau username..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
              >
                <option value="all">Semua Role</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
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
                    Level
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Bergabung
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Terakhir Update
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <p className="mt-2 text-muted-foreground">Memuat data...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Tidak ada pengguna ditemukan
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt={user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-primary">
                                {(user.full_name || user.username || "U").charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.full_name || user.username}</p>
                            <p className="text-sm text-muted-foreground">
                              @{user.username} {user.email && `• ${user.email}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={roleColors[user.role || "user"]}>
                          {roleLabels[user.role || "user"]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Lv. {user.level || 1}</span>
                          <span className="text-sm text-muted-foreground">
                            ({user.xp || 0} XP)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {getRelativeTime(user.updated_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative flex justify-end">
                          <button
                            data-action-btn
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActions(showActions === user.id ? null : user.id);
                            }}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {showActions === user.id && (
                            <div 
                              data-dropdown
                              className="absolute right-0 top-10 w-48 bg-card border border-border rounded-lg shadow-lg z-10"
                            >
                              <div className="p-2">
                                <Link
                                  href={`/admin/users/${user.id}`}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  Lihat Detail
                                </Link>
                                <button 
                                  onClick={() => openRoleModal(user)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                                >
                                  <Shield className="w-4 h-4" />
                                  Ubah Role
                                </button>
                                <button 
                                  onClick={() => openDeleteModal(user)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Hapus
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Menampilkan {users.length} dari {totalCount} pengguna
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button 
                    key={pageNum}
                    variant="outline" 
                    size="sm" 
                    className={currentPage === pageNum ? "bg-primary/10" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Ubah Role Pengguna</h3>
              <button onClick={() => setShowRoleModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-muted-foreground mb-2">
                Pengguna: <span className="font-medium text-foreground">{selectedUser.full_name || selectedUser.username}</span>
              </div>
              <div className="text-muted-foreground mb-4 flex items-center gap-2">
                Role saat ini: <Badge className={roleColors[selectedUser.role || "user"]}>{roleLabels[selectedUser.role || "user"]}</Badge>
              </div>
              
              <label className="block text-sm font-medium mb-2">Role Baru</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            {updateError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{updateError}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRoleModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleUpdateRole}
                disabled={isUpdating || newRole === selectedUser.role}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-destructive">Hapus Pengguna</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus pengguna <span className="font-medium text-foreground">{selectedUser.full_name || selectedUser.username}</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>

            {updateError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{updateError}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1" 
                onClick={handleDeleteUser}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
