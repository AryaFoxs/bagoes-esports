"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Trophy,
  Activity,
  Save,
  Ban,
  Trash2,
  ArrowLeft,
} from "lucide-react";

// Mock user data
const userData = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  username: "johndoe",
  phone: "+62 812-3456-7890",
  role: "user",
  status: "active",
  joinDate: "2025-01-15",
  lastActive: "2 jam lalu",
  bio: "Pemain esports profesional yang berfokus pada game VALORANT.",
  teams: [
    { id: "1", name: "Phoenix Rising", role: "Captain" },
    { id: "2", name: "Dragon Force", role: "Member" },
  ],
  events: [
    { id: "1", title: "Valorant Championship", status: "participated" },
    { id: "2", title: "MLBB Pro League", status: "registered" },
  ],
  stats: {
    eventsJoined: 12,
    teamsJoined: 3,
    wins: 5,
    achievements: 8,
  },
};

export default function UserDetailPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    username: userData.username,
    phone: userData.phone,
    role: userData.role,
    bio: userData.bio,
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div>
      <PageHeader
        title="Detail Pengguna"
        description={`@${userData.username}`}
        icon={User}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pengguna", href: "/admin/users" },
          { label: userData.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/users" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
            </Button>
            {isEditing ? (
              <Button variant="gradient" onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Simpan
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                Edit Profil
              </Button>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {userData.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <Badge
                      className={
                        userData.role === "admin"
                          ? "bg-primary/20 text-primary"
                          : userData.role === "vip"
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {userData.role.toUpperCase()}
                    </Badge>
                    <Badge
                      className={
                        userData.status === "active"
                          ? "bg-accent/20 text-accent"
                          : "bg-destructive/20 text-destructive"
                      }
                    >
                      {userData.status === "active" ? "Aktif" : "Banned"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{userData.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Bergabung {new Date(userData.joinDate).toLocaleDateString("id-ID")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Aktif {userData.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {isEditing && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Edit Informasi</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nama Lengkap
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Username
                    </label>
                    <Input
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telepon
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Teams */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Tim ({userData.teams.length})
              </h3>
              <div className="space-y-3">
                {userData.teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {team.role}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Lihat
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Statistik</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">
                    {userData.stats.eventsJoined}
                  </p>
                  <p className="text-xs text-muted-foreground">Event Diikuti</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-secondary">
                    {userData.stats.teamsJoined}
                  </p>
                  <p className="text-xs text-muted-foreground">Tim</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-accent">
                    {userData.stats.wins}
                  </p>
                  <p className="text-xs text-muted-foreground">Kemenangan</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">
                    {userData.stats.achievements}
                  </p>
                  <p className="text-xs text-muted-foreground">Pencapaian</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Aksi</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="w-4 h-4" />
                  Reset Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-warning hover:bg-warning/10"
                >
                  <Ban className="w-4 h-4" />
                  {userData.status === "banned" ? "Unban User" : "Ban User"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Akun
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
