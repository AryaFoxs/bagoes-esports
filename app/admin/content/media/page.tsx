"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Media } from "@/lib/types/database.types";
import { 
  Image, 
  Upload, 
  Trash2, 
  Download, 
  Search, 
  Loader2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  File,
  Film,
  Music,
  Copy,
} from "lucide-react";

export default function MediaPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMedia = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (search) {
      query = query.or(`original_name.ilike.%${search}%,filename.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setMediaItems(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [supabase, search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!supabase || !user || !e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    const files = Array.from(e.target.files);
    let uploadedCount = 0;
    
    for (const file of files) {
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `uploads/${filename}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);
      
      if (uploadError) {
        setError(`Gagal upload ${file.name}: ${uploadError.message}`);
        continue;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);
      
      // Save to database
      const { error: dbError } = await supabase.from("media").insert({
        filename: filename,
        original_name: file.name,
        file_path: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user.id,
      });
      
      if (!dbError) {
        uploadedCount++;
      }
    }
    
    if (uploadedCount > 0) {
      setSuccess(`${uploadedCount} file berhasil diupload`);
      fetchMedia();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!supabase || !selectedMedia) return;
    
    setIsDeleting(true);
    setError(null);
    
    // Delete from storage
    const filename = selectedMedia.file_path.split('/').pop();
    if (filename) {
      await supabase.storage.from("media").remove([`uploads/${filename}`]);
    }
    
    // Delete from database
    const { error } = await supabase
      .from("media")
      .delete()
      .eq("id", selectedMedia.id);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(`File "${selectedMedia.original_name}" berhasil dihapus`);
      setShowDeleteModal(false);
      fetchMedia();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsDeleting(false);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setSuccess("URL berhasil disalin ke clipboard");
    setTimeout(() => setSuccess(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB";
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
    return bytes + " B";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="w-8 h-8 text-primary" />;
    if (fileType.startsWith("video/")) return <Film className="w-8 h-8 text-secondary" />;
    if (fileType.startsWith("audio/")) return <Music className="w-8 h-8 text-accent" />;
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  const isImageFile = (fileType: string) => fileType.startsWith("image/");

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Kelola gambar, video, dan file media"
        icon={Image}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Konten", href: "/admin/content" },
          { label: "Media" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchMedia}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button 
              variant="gradient" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Upload File
            </Button>
          </div>
        }
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
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

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div 
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium mb-2">Drag & drop file di sini</p>
            <p className="text-sm text-muted-foreground mb-4">
              atau klik untuk memilih file (gambar, video, audio, PDF)
            </p>
            <Button variant="outline" disabled={uploading}>
              {uploading ? "Mengupload..." : "Pilih File"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari media..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-20">
          <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Tidak ada media</h3>
          <p className="text-muted-foreground">
            {search ? "Coba ubah kata kunci pencarian" : "Upload file untuk mulai mengisi media library"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {isImageFile(item.file_type) ? (
                  <img 
                    src={item.file_path} 
                    alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(item.file_type)
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => copyToClipboard(item.file_path)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    asChild
                  >
                    <a href={item.file_path} download target="_blank">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => {
                      setSelectedMedia(item);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-sm truncate" title={item.original_name}>
                  {item.original_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file_size)} • {new Date(item.created_at).toLocaleDateString("id-ID")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-destructive">Hapus File</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus file <span className="font-medium text-foreground">"{selectedMedia.original_name}"</span>? 
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
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
