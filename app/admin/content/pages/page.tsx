"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileCode,
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
  Globe,
} from "lucide-react";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  meta_description: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export default function PagesPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
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

  const fetchPages = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setPages(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, [supabase, search]);

  const handleCreate = async () => {
    if (!supabase || !user) return;
    
    setIsUpdating(true);
    setError(null);

    const slug = formData.slug || generateSlug(formData.title);
    
    const { error } = await supabase.from("pages").insert({
      title: formData.title,
      slug: slug,
      content: formData.content || null,
      meta_description: formData.meta_description || null,
      status: formData.status,
    });

    if (error) {
      if (error.code === "23505") {
        setError("Halaman dengan slug ini sudah ada");
      } else {
        setError(error.message);
      }
    } else {
      setSuccess(`Halaman "${formData.title}" berhasil dibuat`);
      setShowCreateModal(false);
      resetForm();
      fetchPages();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleUpdate = async () => {
    if (!supabase || !selectedPage) return;
    
    setIsUpdating(true);
    setError(null);

    const { error } = await supabase
      .from("pages")
      .update({
        title: formData.title,
        slug: formData.slug,
        content: formData.content || null,
        meta_description: formData.meta_description || null,
        status: formData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedPage.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Halaman "${formData.title}" berhasil diperbarui`);
      setShowEditModal(false);
      fetchPages();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!supabase || !selectedPage) return;
    
    setIsUpdating(true);
    setError(null);

    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", selectedPage.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(`Halaman "${selectedPage.title}" berhasil dihapus`);
      setShowDeleteModal(false);
      fetchPages();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const openEditModal = (page: Page) => {
    setSelectedPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content || "",
      meta_description: page.meta_description || "",
      status: page.status,
    });
    setShowEditModal(true);
    setError(null);
  };

  const openDeleteModal = (page: Page) => {
    setSelectedPage(page);
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
      slug: "",
      content: "",
      meta_description: "",
      status: "draft",
    });
  };

  return (
    <div>
      <PageHeader
        title="Manajemen Halaman"
        description="Kelola halaman statis website"
        icon={FileCode}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Konten", href: "/admin/content" },
          { label: "Halaman" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchPages}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="gradient" className="gap-2" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Tambah Halaman
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

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari halaman..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Halaman</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Terakhir Update</th>
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
                ) : pages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      {search 
                        ? "Tidak ada halaman yang ditemukan" 
                        : "Belum ada halaman. Klik 'Tambah Halaman' untuk membuat halaman baru."}
                    </td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <p className="font-medium">{page.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded">/{page.slug}</code>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={page.status === "published" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}>
                          {page.status === "published" ? "Dipublikasikan" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(page.updated_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/${page.slug}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(page)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => openDeleteModal(page)}
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Tambah Halaman Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul halaman"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <Input
                  placeholder="url-halaman (auto-generate jika kosong)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <Input
                  placeholder="Deskripsi untuk SEO"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konten</label>
                <Textarea
                  placeholder="Tulis konten halaman di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px]"
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

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleCreate}
                disabled={isUpdating || !formData.title}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Halaman</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <Input
                  placeholder="Judul halaman"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <Input
                  placeholder="url-halaman"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <Input
                  placeholder="Deskripsi untuk SEO"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konten</label>
                <Textarea
                  placeholder="Tulis konten halaman di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px]"
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

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleUpdate}
                disabled={isUpdating || !formData.title}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-destructive">Hapus Halaman</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus halaman <span className="font-medium text-foreground">"{selectedPage.title}"</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1" 
                onClick={handleDelete}
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
