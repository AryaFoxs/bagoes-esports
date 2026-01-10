"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Trophy,
  Plus,
  Users,
  Settings,
  Crown,
  UserPlus,
  Eye,
  LogOut,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  game: string;
  logo_url: string | null;
  banner_url: string | null;
  wins: number;
  losses: number;
  max_members: number;
  is_recruiting: boolean;
}

interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "owner" | "captain" | "member";
  joined_at: string;
  team?: Team;
}

interface TeamInvite {
  id: string;
  team_id: string;
  user_id: string;
  invited_by: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  team?: Team;
  inviter?: {
    username: string;
  };
}

export default function MyTeamsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"teams" | "invites">("teams");
  const [myTeams, setMyTeams] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchMyTeams = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    // Fetch teams I'm a member of
    const { data: memberships, error } = await supabase
      .from("team_members")
      .select(`
        *,
        team:teams (
          id,
          name,
          game,
          logo_url,
          banner_url,
          wins,
          losses,
          max_members,
          is_recruiting
        )
      `)
      .eq("user_id", user.id)
      .order("joined_at", { ascending: false });
    
    if (!error && memberships) {
      setMyTeams(memberships);
    }
    
    // Fetch pending invites
    const { data: pendingInvites } = await supabase
      .from("team_invites")
      .select(`
        *,
        team:teams (
          id,
          name,
          game,
          logo_url
        ),
        inviter:profiles!invited_by (
          username
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    
    if (pendingInvites) {
      setInvites(pendingInvites);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchMyTeams();
    }
  }, [supabase, user]);

  // Get member count for each team
  const [teamMemberCounts, setTeamMemberCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchMemberCounts = async () => {
      if (!supabase || myTeams.length === 0) return;
      
      const counts: Record<string, number> = {};
      
      for (const membership of myTeams) {
        const { count } = await supabase
          .from("team_members")
          .select("*", { count: "exact", head: true })
          .eq("team_id", membership.team_id);
        
        counts[membership.team_id] = count || 0;
      }
      
      setTeamMemberCounts(counts);
    };
    
    fetchMemberCounts();
  }, [myTeams, supabase]);

  const handleAcceptInvite = async (invite: TeamInvite) => {
    if (!supabase || !user) return;
    
    setIsProcessing(invite.id);
    
    // Update invite status
    await supabase
      .from("team_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);
    
    // Add user to team
    await supabase.from("team_members").insert({
      team_id: invite.team_id,
      user_id: user.id,
      role: "member",
    });
    
    setSuccess(`Berhasil bergabung dengan ${invite.team?.name}`);
    fetchMyTeams();
    setTimeout(() => setSuccess(null), 3000);
    
    setIsProcessing(null);
  };

  const handleDeclineInvite = async (invite: TeamInvite) => {
    if (!supabase) return;
    
    setIsProcessing(invite.id);
    
    await supabase
      .from("team_invites")
      .update({ status: "declined" })
      .eq("id", invite.id);
    
    setSuccess("Undangan ditolak");
    fetchMyTeams();
    setTimeout(() => setSuccess(null), 3000);
    
    setIsProcessing(null);
  };

  const handleLeaveTeam = async (membership: TeamMember) => {
    if (!supabase) return;
    
    if (membership.role === "owner") {
      alert("Anda tidak bisa keluar karena Anda adalah pemilik tim. Transfer kepemilikan terlebih dahulu.");
      return;
    }
    
    if (!confirm(`Apakah Anda yakin ingin keluar dari tim ${membership.team?.name}?`)) return;
    
    setIsProcessing(membership.id);
    
    await supabase
      .from("team_members")
      .delete()
      .eq("id", membership.id);
    
    setSuccess(`Berhasil keluar dari ${membership.team?.name}`);
    fetchMyTeams();
    setTimeout(() => setSuccess(null), 3000);
    
    setIsProcessing(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tim Saya</h1>
            <p className="text-muted-foreground">Kelola dan bergabung dengan tim</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchMyTeams}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="gradient" className="gap-2" asChild>
            <Link href="/dashboard/teams/create">
              <Plus className="w-4 h-4" />
              Buat Tim
            </Link>
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "teams" ? "default" : "ghost"}
          onClick={() => setActiveTab("teams")}
        >
          Tim Saya ({myTeams.length})
        </Button>
        <Button
          variant={activeTab === "invites" ? "default" : "ghost"}
          onClick={() => setActiveTab("invites")}
        >
          Undangan
          {invites.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {invites.length}
            </Badge>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeTab === "teams" ? (
        <div className="grid md:grid-cols-2 gap-6">
          {myTeams.map((membership) => {
            const team = membership.team;
            const memberCount = teamMemberCounts[membership.team_id] || 0;
            
            return (
              <Card key={membership.id} className="overflow-hidden">
                <div 
                  className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative"
                  style={team?.banner_url ? { 
                    backgroundImage: `url(${team.banner_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  } : {}}
                >
                  {(membership.role === "owner" || membership.role === "captain") && (
                    <Badge className="absolute top-3 right-3 bg-accent/20 text-accent">
                      <Crown className="w-3 h-3 mr-1" />
                      {membership.role === "owner" ? "Owner" : "Captain"}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 pt-0 relative">
                  <div className="w-16 h-16 rounded-xl bg-card border-4 border-card -mt-8 mb-3 flex items-center justify-center shadow-lg overflow-hidden">
                    {team?.logo_url ? (
                      <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy className="w-8 h-8 text-primary" />
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-1">{team?.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{team?.game}</p>

                  <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="font-bold">{memberCount}/{team?.max_members || 5}</p>
                      <p className="text-xs text-muted-foreground">Anggota</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="font-bold text-accent">{team?.wins || 0}</p>
                      <p className="text-xs text-muted-foreground">W</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="font-bold text-destructive">{team?.losses || 0}</p>
                      <p className="text-xs text-muted-foreground">L</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/tim/${team?.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Link>
                    </Button>
                    {(membership.role === "owner" || membership.role === "captain") && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/teams/${team?.id}/manage`}>
                          <Settings className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => handleLeaveTeam(membership)}
                      disabled={isProcessing === membership.id}
                    >
                      {isProcessing === membership.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Browse Teams CTA */}
          <Card className="border-dashed flex items-center justify-center min-h-[300px]">
            <div className="text-center p-6">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold mb-2">Cari Tim Lain</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Jelajahi tim yang membuka rekrutmen
              </p>
              <Button variant="outline" asChild>
                <Link href="/tim">Browse Tim</Link>
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.length > 0 ? (
            invites.map((invite) => (
              <Card key={invite.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
                        {invite.team?.logo_url ? (
                          <img src={invite.team.logo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <UserPlus className="w-7 h-7 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{invite.team?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {invite.team?.game} • Diundang oleh @{invite.inviter?.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="gradient" 
                        size="sm"
                        onClick={() => handleAcceptInvite(invite)}
                        disabled={isProcessing === invite.id}
                      >
                        {isProcessing === invite.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Terima"
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeclineInvite(invite)}
                        disabled={isProcessing === invite.id}
                      >
                        Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada undangan tim</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
