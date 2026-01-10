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
import { 
  MessageSquare, 
  Users, 
  Trophy, 
  Flag, 
  ArrowRight, 
  Loader2,
  RefreshCw,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
  Search,
} from "lucide-react";

interface ForumPost {
  id: string;
  title: string;
  content: string | null;
  author_id: string;
  category: string;
  status: "active" | "closed" | "pinned";
  views: number;
  reply_count: number;
  created_at: string;
  author?: {
    username: string;
    full_name: string | null;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: "active" | "upcoming" | "completed";
  reward: string | null;
  participants: number;
  created_at: string;
}

const forumCategories = [
  "Diskusi Umum",
  "Tips & Tricks",
  "Cari Tim",
  "Turnamen",
  "Bug Report",
  "Saran & Masukan",
];

export default function CommunityPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  // Stats
  const [stats, setStats] = useState({
    totalMembers: 0,
    forumPosts: 0,
    activeChallenges: 0,
    pendingReports: 0,
  });
  
  // Forum posts
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showForumListModal, setShowForumListModal] = useState(false);
  const [showChallengeListModal, setShowChallengeListModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form data
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "",
  });
  
  const [challengeForm, setChallengeForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    reward: "",
  });

  const fetchStats = async () => {
    if (!supabase) return;
    
    // Total members
    const { count: membersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    
    // Forum posts
    const { count: postsCount } = await supabase
      .from("forum_posts")
      .select("*", { count: "exact", head: true });
    
    // Active challenges
    const { count: challengesCount } = await supabase
      .from("challenges")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    
    // Pending reports
    const { count: reportsCount } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    
    setStats({
      totalMembers: membersCount || 0,
      forumPosts: postsCount || 0,
      activeChallenges: challengesCount || 0,
      pendingReports: reportsCount || 0,
    });
  };

  const fetchForumPosts = async () => {
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from("forum_posts")
      .select(`
        *,
        author:profiles!author_id (
          username,
          full_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setForumPosts(data);
    }
  };

  const fetchChallenges = async () => {
    if (!supabase) return;
    
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setChallenges(data);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchForumPosts(), fetchChallenges()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [supabase]);

  const handleCreatePost = async () => {
    if (!supabase || !user) return;
    
    setIsSubmitting(true);
    setError(null);

    const { error } = await supabase.from("forum_posts").insert({
      title: postForm.title,
      content: postForm.content || null,
      category: postForm.category,
      author_id: user.id,
      status: "active",
      views: 0,
      reply_count: 0,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Postingan forum berhasil dibuat");
      setShowPostModal(false);
      setPostForm({ title: "", content: "", category: "" });
      fetchForumPosts();
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const handleDeletePost = async (post: ForumPost) => {
    if (!supabase) return;
    
    const { error } = await supabase
      .from("forum_posts")
      .delete()
      .eq("id", post.id);

    if (!error) {
      setSuccess(`Postingan "${post.title}" berhasil dihapus`);
      fetchForumPosts();
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleCreateChallenge = async () => {
    if (!supabase || !user) return;
    
    setIsSubmitting(true);
    setError(null);

    const now = new Date();
    const startDate = new Date(challengeForm.start_date);
    let status: "upcoming" | "active" | "completed" = "upcoming";
    if (startDate <= now) status = "active";

    const { error } = await supabase.from("challenges").insert({
      title: challengeForm.title,
      description: challengeForm.description || null,
      start_date: challengeForm.start_date,
      end_date: challengeForm.end_date,
      reward: challengeForm.reward || null,
      status: status,
      participants: 0,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Tantangan berhasil dibuat");
      setShowChallengeModal(false);
      setChallengeForm({ title: "", description: "", start_date: "", end_date: "", reward: "" });
      fetchChallenges();
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteChallenge = async (challenge: Challenge) => {
    if (!supabase) return;
    
    const { error } = await supabase
      .from("challenges")
      .delete()
      .eq("id", challenge.id);

    if (!error) {
      setSuccess(`Tantangan "${challenge.title}" berhasil dihapus`);
      fetchChallenges();
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  const communityStats = [
    { label: "Total Anggota", value: stats.totalMembers.toLocaleString(), icon: Users, color: "text-primary" },
    { label: "Postingan Forum", value: stats.forumPosts.toLocaleString(), icon: MessageSquare, color: "text-secondary" },
    { label: "Tantangan Aktif", value: stats.activeChallenges.toString(), icon: Trophy, color: "text-accent" },
    { label: "Laporan Pending", value: stats.pendingReports.toString(), icon: Flag, color: "text-destructive" },
  ];

  return (
    <div>
      <PageHeader
        title="Manajemen Komunitas"
        description="Kelola forum, anggota, dan kegiatan komunitas"
        icon={MessageSquare}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Komunitas" },
        ]}
        actions={
          <Button variant="outline" className="gap-2" onClick={fetchAll}>
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
      {loading ? (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="w-16 h-6 bg-muted animate-pulse rounded" />
                  <div className="w-20 h-3 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {communityStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Topics */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Topik Terbaru</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowForumListModal(true)}>
                  Lihat Semua
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowPostModal(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : forumPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Belum ada postingan forum
              </p>
            ) : (
              <div className="space-y-3">
                {forumPosts.slice(0, 5).map((topic) => (
                  <div key={topic.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="font-medium text-sm mb-1">{topic.title}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>@{topic.author?.username || "Unknown"}</span>
                      <span>{topic.reply_count} balasan • {formatTimeAgo(topic.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Challenges & Quick Actions */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Tantangan Aktif</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowChallengeListModal(true)}>
                    Lihat Semua
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowChallengeModal(true)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 animate-pulse">
                      <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : challenges.filter(c => c.status === "active").length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Tidak ada tantangan aktif
                </p>
              ) : (
                <div className="space-y-2">
                  {challenges.filter(c => c.status === "active").slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{challenge.title}</p>
                        <Badge variant="default">{challenge.participants} peserta</Badge>
                      </div>
                      {challenge.reward && (
                        <p className="text-xs text-accent mt-1">Hadiah: {challenge.reward}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between" onClick={() => setShowChallengeModal(true)}>
                  Buat Tantangan <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => setShowPostModal(true)}>
                  Buat Postingan Forum <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between text-destructive" asChild>
                  <Link href="/admin/security/reports">
                    Lihat Laporan <Badge variant="destructive" className="ml-2">{stats.pendingReports}</Badge>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Buat Postingan Forum</h3>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul postingan"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Kategori *</label>
                <select
                  value={postForm.category}
                  onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="">Pilih Kategori</option>
                  {forumCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konten</label>
                <Textarea
                  placeholder="Tulis konten..."
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowPostModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleCreatePost}
                disabled={isSubmitting || !postForm.title || !postForm.category}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Posting"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Buat Tantangan Baru</h3>
              <button onClick={() => setShowChallengeModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul tantangan"
                  value={challengeForm.title}
                  onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <Textarea
                  placeholder="Deskripsi tantangan..."
                  value={challengeForm.description}
                  onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mulai *</label>
                  <Input
                    type="datetime-local"
                    value={challengeForm.start_date}
                    onChange={(e) => setChallengeForm({ ...challengeForm, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Berakhir *</label>
                  <Input
                    type="datetime-local"
                    value={challengeForm.end_date}
                    onChange={(e) => setChallengeForm({ ...challengeForm, end_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Hadiah</label>
                <Input
                  placeholder="Contoh: 100.000 XP atau Badge Eksklusif"
                  value={challengeForm.reward}
                  onChange={(e) => setChallengeForm({ ...challengeForm, reward: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowChallengeModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleCreateChallenge}
                disabled={isSubmitting || !challengeForm.title || !challengeForm.start_date || !challengeForm.end_date}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buat"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Forum List Modal */}
      {showForumListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Semua Postingan Forum</h3>
              <button onClick={() => setShowForumListModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {forumPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada postingan</p>
              ) : (
                forumPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{post.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline">{post.category}</Badge>
                        <span>@{post.author?.username}</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                        <span>•</span>
                        <span>{post.reply_count} balasan</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => handleDeletePost(post)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Challenge List Modal */}
      {showChallengeListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Semua Tantangan</h3>
              <button onClick={() => setShowChallengeListModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {challenges.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada tantangan</p>
              ) : (
                challenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{challenge.title}</p>
                        <Badge className={
                          challenge.status === "active" ? "bg-accent/20 text-accent" :
                          challenge.status === "upcoming" ? "bg-primary/20 text-primary" :
                          "bg-muted text-muted-foreground"
                        }>
                          {challenge.status === "active" ? "Aktif" : 
                           challenge.status === "upcoming" ? "Akan Datang" : "Selesai"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{challenge.participants} peserta</span>
                        {challenge.reward && (
                          <>
                            <span>•</span>
                            <span>Hadiah: {challenge.reward}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => handleDeleteChallenge(challenge)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
