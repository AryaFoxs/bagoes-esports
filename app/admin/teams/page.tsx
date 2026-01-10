"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Team } from "@/lib/types/database.types";
import {
  Trophy,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Users,
} from "lucide-react";

interface TeamWithMembers extends Team {
  member_count?: number;
}

export default function TeamsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithMembers | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    region: "",
    is_recruiting: false,
  });

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const fetchTeams = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,game.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      // Fetch member counts for each team
      const teamsWithCounts = await Promise.all(
        data.map(async (team: Team) => {
          const { count } = await supabase
            .from("team_members")
            .select("*", { count: "exact", head: true })
            .eq("team_id", team.id)
            .eq("status", "active");
          
          return {
            ...team,
            member_count: count || 0,
          };
        })
      );
      
      setTeams(teamsWithCounts);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, [supabase, search]);

  const filterTeams = (teams: TeamWithMembers[]) => {
    if (statusFilter === "all") return teams;
    if (statusFilter === "recruiting") return teams.filter(t => t.is_recruiting);
    if (statusFilter === "not-recruiting") return teams.filter(t => !t.is_recruiting);
    return teams;
  };

  const filteredTeams = filterTeams(teams);

  const handleCreateTeam = async () => {
    if (!supabase || !user) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const slug = generateSlug(formData.name) + "-" + Date.now();
    
    const { error } = await supabase.from("teams").insert({
      name: formData.name,
      slug: slug,
      game: formData.game,
      description: formData.description || null,
      region: formData.region || null,
      is_recruiting: formData.is_recruiting,
      wins: 0,
      losses: 0,
      created_by: user.id,
    });

    if (error) {
      if (error.code === "23505") {
        setUpdateError("Tim dengan nama ini sudah ada");
      } else {
        setUpdateError(error.message);
      }
    } else {
      setUpdateSuccess(`Tim "${formData.name}" berhasil dibuat`);
      setShowCreateModal(false);
      resetForm();
      fetchTeams();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleUpdateTeam = async () => {
    if (!supabase || !selectedTeam) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const { error } = await supabase
      .from("teams")
      .update({
        name: formData.name,
        game: formData.game,
        description: formData.description || null,
        region: formData.region || null,
        is_recruiting: formData.is_recruiting,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedTeam.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Tim "${formData.name}" berhasil diperbarui`);
      setShowEditModal(false);
      fetchTeams();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleDeleteTeam = async () => {
    if (!supabase || !selectedTeam) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", selectedTeam.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Tim "${selectedTeam.name}" berhasil dihapus`);
      setShowDeleteModal(false);
      fetchTeams();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const openEditModal = (team: TeamWithMembers) => {
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      game: team.game,
      description: team.description || "",
      region: team.region || "",
      is_recruiting: team.is_recruiting,
    });
    setShowEditModal(true);
    setUpdateError(null);
  };

  const openDeleteModal = (team: TeamWithMembers) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
    setUpdateError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
    setUpdateError(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      game: "",
      description: "",
      region: "",
      is_recruiting: false,
    });
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Tim"
        description="Kelola semua tim esports"
        icon={Trophy}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tim" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchTeams}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="gradient" className="gap-2" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Tambah Tim
            </Button>
          </div>
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
                placeholder="Cari tim..."
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
              <option value="recruiting">Rekrutmen Terbuka</option>
              <option value="not-recruiting">Tidak Rekrutmen</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Teams Grid */}
      {!loading && (
        <>
          {filteredTeams.length === 0 ? (
            <div className="text-center py-20">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tidak ada tim ditemukan</h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Coba ubah kata kunci pencarian" : "Klik 'Tambah Tim' untuk membuat tim baru"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                    {team.logo_url && (
                      <img 
                        src={team.logo_url} 
                        alt={team.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                    )}
                    <Badge
                      className={`absolute top-3 right-3 ${
                        team.is_recruiting
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {team.is_recruiting ? "Rekrutmen" : "Tidak Rekrutmen"}
                    </Badge>
                  </div>
                  <CardContent className="p-5 pt-0 relative">
                    <div className="w-16 h-16 rounded-xl bg-card border-4 border-card -mt-8 mb-3 flex items-center justify-center shadow-lg overflow-hidden">
                      {team.logo_url ? (
                        <img 
                          src={team.logo_url} 
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Shield className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">{team.game}</p>
                        {team.region && (
                          <p className="text-xs text-muted-foreground">{team.region}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="font-bold">{team.member_count || 0}</p>
                        <p className="text-xs text-muted-foreground">Anggota</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="font-bold text-accent">{team.wins}</p>
                        <p className="text-xs text-muted-foreground">Menang</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="font-bold text-destructive">{team.losses}</p>
                        <p className="text-xs text-muted-foreground">Kalah</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/admin/teams/${team.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(team)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => openDeleteModal(team)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Tambah Tim Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Tim *</label>
                <Input
                  placeholder="Nama tim"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Game *</label>
                <select
                  value={formData.game}
                  onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="">Pilih Game</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="PUBG Mobile">PUBG Mobile</option>
                  <option value="Free Fire">Free Fire</option>
                  <option value="Dota 2">Dota 2</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Region</label>
                <Input
                  placeholder="Jakarta, Bandung, etc."
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <Textarea
                  placeholder="Deskripsi tim..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_recruiting"
                  checked={formData.is_recruiting}
                  onChange={(e) => setFormData({ ...formData, is_recruiting: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <label htmlFor="is_recruiting" className="text-sm">
                  Buka Rekrutmen
                </label>
              </div>
            </div>

            {updateError && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{updateError}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleCreateTeam}
                disabled={isUpdating || !formData.name || !formData.game}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Tim</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Tim *</label>
                <Input
                  placeholder="Nama tim"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Game *</label>
                <select
                  value={formData.game}
                  onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="">Pilih Game</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="PUBG Mobile">PUBG Mobile</option>
                  <option value="Free Fire">Free Fire</option>
                  <option value="Dota 2">Dota 2</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Region</label>
                <Input
                  placeholder="Jakarta, Bandung, etc."
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <Textarea
                  placeholder="Deskripsi tim..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_recruiting_edit"
                  checked={formData.is_recruiting}
                  onChange={(e) => setFormData({ ...formData, is_recruiting: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <label htmlFor="is_recruiting_edit" className="text-sm">
                  Buka Rekrutmen
                </label>
              </div>
            </div>

            {updateError && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{updateError}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleUpdateTeam}
                disabled={isUpdating || !formData.name || !formData.game}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-destructive">Hapus Tim</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus tim <span className="font-medium text-foreground">"{selectedTeam.name}"</span>? 
              Semua data anggota tim juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
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
                onClick={handleDeleteTeam}
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
