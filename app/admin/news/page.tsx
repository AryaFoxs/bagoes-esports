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
  Newspaper, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Send,
} from "lucide-react";

interface News {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string | null;
  status: "draft" | "published";
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function NewsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featured_image: "",
    status: "draft" as "draft" | "published",
  });

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const fetchNews = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setNewsList(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [supabase, statusFilter, search]);

  const handleCreate = async () => {
    if (!supabase || !user) return;
    
    setIsSubmitting(true);
    setError(null);

    const slug = generateSlug(formData.title) + "-" + Date.now();
    
    const { error } = await supabase.from("news").insert({
      title: formData.title,
      slug: slug,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      featured_image: formData.featured_image || null,
      status: formData.status,
      author_id: user.id,
      views: 0,
      published_at: formData.status === "published" ? new Date().toISOString() : null,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Berita "${formData.title}" berhasil dibuat`);
      setShowCreateModal(false);
      resetForm();
      fetchNews();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const handleUpdate = async () => {
    if (!supabase || !selectedNews) return;
    
    setIsSubmitting(true);
    setError(null);

    const updateData: Record<string, unknown> = {
      title: formData.title,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      featured_image: formData.featured_image || null,
      status: formData.status,
      updated_at: new Date().toISOString(),
    };
    
    if (formData.status === "published" && selectedNews.status !== "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("news")
      .update(updateData)
      .eq("id", selectedNews.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Berita "${formData.title}" berhasil diperbarui`);
      setShowEditModal(false);
      fetchNews();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!supabase || !selectedNews) return;
    
    setIsSubmitting(true);
    setError(null);

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", selectedNews.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Berita "${selectedNews.title}" berhasil dihapus`);
      setShowDeleteModal(false);
      fetchNews();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const handlePublish = async (news: News) => {
    if (!supabase) return;
    
    const { error } = await supabase
      .from("news")
      .update({ 
        status: "published", 
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", news.id);

    if (!error) {
      setSuccess(`Berita "${news.title}" berhasil dipublikasikan`);
      fetchNews();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const openEditModal = (news: News) => {
    setSelectedNews(news);
    setFormData({
      title: news.title,
      excerpt: news.excerpt || "",
      content: news.content || "",
      featured_image: news.featured_image || "",
      status: news.status,
    });
    setShowEditModal(true);
    setError(null);
  };

  const openDeleteModal = (news: News) => {
    setSelectedNews(news);
    setShowDeleteModal(true);
    setError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      featured_image: "",
      status: "draft",
    });
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Berita"
        description="Kelola berita dan pengumuman"
        icon={Newspaper}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Berita" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchNews}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="gradient" className="gap-2" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Tulis Berita
            </Button>
          </div>
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

      {/* Search & Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari berita..."
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
              <option value="published">Dipublikasikan</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : newsList.length === 0 ? (
        <div className="text-center py-20">
          <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Tidak ada berita</h3>
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== "all" 
              ? "Coba ubah filter pencarian" 
              : "Klik 'Tulis Berita' untuk membuat berita baru"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {newsList.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <Badge
                        className={
                          item.status === "published"
                            ? "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {item.status === "published" ? "Publikasi" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{item.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {item.published_at && (
                        <span>{new Date(item.published_at).toLocaleDateString("id-ID")}</span>
                      )}
                      <span>{item.views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.status === "draft" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-accent"
                        onClick={() => handlePublish(item)}
                        title="Publikasikan"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/berita/${item.slug}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => openDeleteModal(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Tulis Berita Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul berita"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ringkasan</label>
                <Textarea
                  placeholder="Ringkasan berita untuk preview..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konten</label>
                <Textarea
                  placeholder="Tulis konten berita di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL Gambar Featured</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publikasikan</option>
                </select>
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
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleCreate}
                disabled={isSubmitting || !formData.title}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Berita</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul berita"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ringkasan</label>
                <Textarea
                  placeholder="Ringkasan berita..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konten</label>
                <Textarea
                  placeholder="Tulis konten berita di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL Gambar Featured</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Dipublikasikan</option>
                </select>
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
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleUpdate}
                disabled={isSubmitting || !formData.title}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-destructive">Hapus Berita</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus berita <span className="font-medium text-foreground">"{selectedNews.title}"</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
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
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
