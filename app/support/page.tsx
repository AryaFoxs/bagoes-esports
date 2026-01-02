"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  HeadphonesIcon,
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Send,
  HelpCircle,
  Trophy,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";

const helpTopics = [
  {
    icon: Trophy,
    title: "Turnamen & Event",
    description: "Pendaftaran, aturan, dan hasil turnamen",
    articles: 12,
  },
  {
    icon: Users,
    title: "Tim & Komunitas",
    description: "Membuat tim, bergabung komunitas",
    articles: 8,
  },
  {
    icon: CreditCard,
    title: "Pembayaran",
    description: "Biaya pendaftaran dan hadiah",
    articles: 6,
  },
  {
    icon: Settings,
    title: "Akun & Profil",
    description: "Pengaturan akun dan keamanan",
    articles: 10,
  },
];

const popularArticles = [
  {
    title: "Cara mendaftar turnamen",
    category: "Turnamen",
    views: 1250,
  },
  {
    title: "Membuat tim esports baru",
    category: "Tim",
    views: 980,
  },
  {
    title: "Reset password akun",
    category: "Akun",
    views: 850,
  },
  {
    title: "Sistem poin dan leaderboard",
    category: "Turnamen",
    views: 720,
  },
];

export default function SupportPage() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setTicketSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <HeadphonesIcon className="w-3 h-3 mr-1" />
              Support
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pusat <span className="gradient-text">Bantuan</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Cari jawaban atau hubungi tim support kami untuk bantuan.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari bantuan..."
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Topik Bantuan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpTopics.map((topic) => (
              <Card key={topic.title} hover className="cursor-pointer group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <topic.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <BookOpen className="w-4 h-4" />
                    {topic.articles} artikel
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles & Submit Ticket */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Popular Articles */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Artikel Populer</h2>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <Card
                    key={index}
                    hover
                    className="cursor-pointer group"
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {article.category} • {article.views} views
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6" asChild>
                <Link href="/faq" className="gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Lihat Semua FAQ
                </Link>
              </Button>
            </div>

            {/* Submit Ticket */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Kirim Tiket</h2>

              {ticketSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Tiket Terkirim!</h3>
                    <p className="text-muted-foreground mb-4">
                      Tiket Anda dengan nomor <Badge>#TKT-2026-001</Badge> telah
                      diterima.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Tim support kami akan merespons dalam 24 jam kerja.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setTicketSubmitted(false)}
                    >
                      Kirim Tiket Lain
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="email@contoh.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Kategori *
                        </label>
                        <select className="w-full h-11 px-4 rounded-lg border border-border bg-input text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option value="">Pilih kategori...</option>
                          <option value="tournament">Turnamen & Event</option>
                          <option value="team">Tim & Komunitas</option>
                          <option value="payment">Pembayaran</option>
                          <option value="account">Akun & Profil</option>
                          <option value="technical">Masalah Teknis</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Prioritas
                        </label>
                        <div className="flex gap-2">
                          {["Rendah", "Sedang", "Tinggi"].map((priority) => (
                            <label
                              key={priority}
                              className="flex-1 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="priority"
                                value={priority.toLowerCase()}
                                className="peer hidden"
                                defaultChecked={priority === "Sedang"}
                              />
                              <div className="p-3 text-center text-sm rounded-lg border border-border peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                                {priority}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subjek *
                        </label>
                        <Input placeholder="Ringkasan masalah Anda" required />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Deskripsi *
                        </label>
                        <Textarea
                          placeholder="Jelaskan masalah Anda secara detail..."
                          className="min-h-[120px]"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="gradient"
                        className="w-full gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>Mengirim...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Kirim Tiket
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="overflow-hidden border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center animate-pulse-glow">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">Live Chat</h3>
                    <Badge variant="success">Online</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Chat langsung dengan tim support kami
                  </p>
                </div>
              </div>
              <Button variant="gradient" size="lg" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Mulai Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Alternatives */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Cara Lain Menghubungi Kami</h2>
            <p className="text-muted-foreground">
              Pilih cara yang paling nyaman untuk Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  support@bagoesesports.id
                </p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Respon dalam 24 jam
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-bold mb-1">Discord</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  discord.gg/bagoesesports
                </p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Komunitas 24/7
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <HelpCircle className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-1">FAQ</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Pertanyaan umum
                </p>
                <Link
                  href="/faq"
                  className="text-xs text-primary hover:underline"
                >
                  Lihat FAQ →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
