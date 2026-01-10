"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  HeadphonesIcon,
  MessageCircle,
  HelpCircle,
  FileText,
  Send,
  Clock,
  CheckCircle,
  Loader2,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  last_reply_by: string | null;
  created_at: string;
  updated_at: string;
}

const faqItems = [
  { question: "Bagaimana cara mendaftar event?", link: "/faq#register-event" },
  { question: "Bagaimana cara membuat tim?", link: "/faq#create-team" },
  { question: "Metode pembayaran apa saja yang tersedia?", link: "/faq#payment" },
];

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  open: { label: "Open", class: "bg-primary/20 text-primary", icon: Clock },
  in_progress: { label: "In Progress", class: "bg-warning/20 text-warning", icon: Clock },
  resolved: { label: "Resolved", class: "bg-accent/20 text-accent", icon: CheckCircle },
  closed: { label: "Closed", class: "bg-muted text-muted-foreground", icon: CheckCircle },
};

export default function SupportPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
  });

  const fetchTickets = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setTickets(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [supabase, user]);

  const handleSubmitTicket = async () => {
    if (!supabase || !user) return;
    if (!formData.subject || !formData.category || !formData.message) {
      setError("Semua field harus diisi");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject: formData.subject,
      category: formData.category,
      message: formData.message,
      status: "open",
    });
    
    if (error) {
      setError("Gagal mengirim tiket. Coba lagi.");
    } else {
      setSuccess("Tiket berhasil dikirim!");
      setFormData({ subject: "", category: "", message: "" });
      setShowForm(false);
      fetchTickets();
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <HeadphonesIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Bantuan</h1>
              <p className="text-muted-foreground">Butuh bantuan? Kami siap membantu</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTickets}>
            <RefreshCw className="w-4 h-4" />
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <HelpCircle className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-1">FAQ</h3>
                <p className="text-sm text-muted-foreground mb-3">Pertanyaan umum</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/faq">Lihat FAQ</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-1">Panduan</h3>
                <p className="text-sm text-muted-foreground mb-3">Cara penggunaan</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/support">Baca Panduan</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-1">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">Chat langsung</p>
                <Button variant="gradient" size="sm">Mulai Chat</Button>
              </CardContent>
            </Card>
          </div>

          {/* My Tickets */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Tiket Saya</h3>
                <Button variant="gradient" size="sm" onClick={() => setShowForm(!showForm)}>
                  {showForm ? "Tutup" : "Buat Tiket"}
                </Button>
              </div>

              {showForm && (
                <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Tiket Baru</h4>
                  
                  {error && (
                    <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <div className="flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Subjek</label>
                      <Input
                        placeholder="Subjek pertanyaan Anda"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="">Pilih Kategori</option>
                        <option value="account">Akun</option>
                        <option value="payment">Pembayaran</option>
                        <option value="event">Event</option>
                        <option value="technical">Teknis</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Pesan</label>
                      <Textarea
                        placeholder="Jelaskan masalah Anda..."
                        className="min-h-[100px]"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <Button 
                      variant="gradient" 
                      className="gap-2"
                      onClick={handleSubmitTicket}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Kirim Tiket
                    </Button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <HeadphonesIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Belum ada tiket support</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => {
                    const config = statusConfig[ticket.status] || statusConfig.open;
                    const StatusIcon = config.icon;
                    return (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-muted-foreground">
                              TKT-{ticket.id.slice(0, 3).toUpperCase()}
                            </span>
                            <Badge className={config.class}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(ticket.created_at)}
                            {ticket.last_reply_by && ` • Balasan terakhir: ${ticket.last_reply_by}`}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Lihat
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">FAQ Populer</h3>
              <div className="space-y-2">
                {faqItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.link}
                    className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                  >
                    {item.question}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <HeadphonesIcon className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Butuh bantuan cepat?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tim support kami siap membantu 24/7
              </p>
              <Button variant="gradient" className="w-full">Hubungi Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
