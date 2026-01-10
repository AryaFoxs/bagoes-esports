"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Article } from "@/lib/types/database.types";
import {
  FileText,
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
  Archive,
} from "lucide-react";

const categories = [
  "Berita",
  "Tips & Tricks",
  "Interview",
  "Review",
  "Tutorial",
  "E-Sports",
  "Gaming",
  "Announcement",
];

export default function ArticlesPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const { user, profile } = useAuth();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    featured_image: "",
    status: "draft" as "draft" | "published" | "archived",
  });

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const fetchArticles = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Apply status filter
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setArticles(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [supabase, statusFilter, search]);

  const handleCreateArticle = async () => {
    if (!supabase || !user) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const slug = generateSlug(formData.title) + "-" + Date.now();
    
    const insertData: Record<string, unknown> = {
      title: formData.title,
      slug: slug,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      category: formData.category,
      featured_image: formData.featured_image || null,
      status: formData.status,
      author_id: user.id,
      views: 0,
      published_at: formData.status === "published" ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("articles").insert(insertData);

    if (error) {
      if (error.code === "23505") {
        setUpdateError("Artikel dengan judul ini sudah ada");
      } else {
        setUpdateError(error.message);
      }
    } else {
      setUpdateSuccess(`Artikel "${formData.title}" berhasil dibuat`);
      setShowCreateModal(false);
      resetForm();
      fetchArticles();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleUpdateArticle = async () => {
    if (!supabase || !selectedArticle) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const updateData: Record<string, unknown> = {
      title: formData.title,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      category: formData.category,
      featured_image: formData.featured_image || null,
      status: formData.status,
      updated_at: new Date().toISOString(),
    };
    
    // Set published_at if status changed to published
    if (formData.status === "published" && selectedArticle.status !== "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", selectedArticle.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Artikel "${formData.title}" berhasil diperbarui`);
      setShowEditModal(false);
      fetchArticles();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleDeleteArticle = async () => {
    if (!supabase || !selectedArticle) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", selectedArticle.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Artikel "${selectedArticle.title}" berhasil dihapus`);
      setShowDeleteModal(false);
      fetchArticles();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handlePublish = async (article: Article) => {
    if (!supabase) return;
    
    const { error } = await supabase
      .from("articles")
      .update({ 
        status: "published", 
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", article.id);

    if (!error) {
      setUpdateSuccess(`Artikel "${article.title}" berhasil dipublikasikan`);
      fetchArticles();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
  };

  const openEditModal = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content || "",
      category: article.category,
      featured_image: article.featured_image || "",
      status: article.status,
    });
    setShowEditModal(true);
    setUpdateError(null);
  };

  const openDeleteModal = (article: Article) => {
    setSelectedArticle(article);
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
      title: "",
      excerpt: "",
      content: "",
      category: "",
      featured_image: "",
      status: "draft",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-accent/20 text-accent">Dipublikasikan</Badge>;
      case "draft":
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>;
      case "archived":
        return <Badge className="bg-secondary/20 text-secondary">Diarsipkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Artikel"
        description="Kelola blog dan artikel website"
        icon={FileText}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Konten", href: "/admin/content" },
          { label: "Artikel" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchArticles}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="gradient" className="gap-2" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Tulis Artikel
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
                placeholder="Cari artikel..."
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
              <option value="archived">Diarsipkan</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Judul</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Views</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <p className="mt-2 text-muted-foreground">Memuat data...</p>
                    </td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      {search || statusFilter !== "all" 
                        ? "Tidak ada artikel yang ditemukan" 
                        : "Belum ada artikel. Klik 'Tulis Artikel' untuk membuat artikel baru."}
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {profile?.full_name || "Admin"} • {article.category}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">{article.views.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          {article.status === "draft" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent"
                              onClick={() => handlePublish(article)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${article.slug}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(article)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => openDeleteModal(article)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Tulis Artikel Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul artikel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ringkasan</label>
                <Textarea
                  placeholder="Ringkasan artikel (untuk preview)..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konten</label>
                <Textarea
                  placeholder="Tulis konten artikel di sini..."
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" | "archived" })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publikasikan</option>
                </select>
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
                onClick={handleCreateArticle}
                disabled={isUpdating || !formData.title || !formData.category}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {showEditModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Artikel</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul artikel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Ringkasan</label>
                <Textarea
                  placeholder="Ringkasan artikel..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konten</label>
                <Textarea
                  placeholder="Tulis konten artikel di sini..."
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
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" | "archived" })}
                  className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Dipublikasikan</option>
                  <option value="archived">Diarsipkan</option>
                </select>
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
                onClick={handleUpdateArticle}
                disabled={isUpdating || !formData.title || !formData.category}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-destructive">Hapus Artikel</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus artikel <span className="font-medium text-foreground">"{selectedArticle.title}"</span>? 
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
                onClick={handleDeleteArticle}
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
