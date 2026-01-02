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
  MessageCircle,
  HelpCircle,
  FileText,
  Send,
  Clock,
  CheckCircle,
} from "lucide-react";

const myTickets = [
  {
    id: "TKT-001",
    subject: "Masalah pembayaran event",
    status: "open",
    date: "2026-01-10",
    lastReply: "Admin",
  },
  {
    id: "TKT-002",
    subject: "Akun tidak bisa login",
    status: "resolved",
    date: "2025-12-20",
    lastReply: "Support",
  },
];

const faqItems = [
  {
    question: "Bagaimana cara mendaftar event?",
    link: "/faq#register-event",
  },
  {
    question: "Bagaimana cara membuat tim?",
    link: "/faq#create-team",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    link: "/faq#payment",
  },
];

export default function SupportPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <HeadphonesIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Bantuan</h1>
            <p className="text-muted-foreground">Butuh bantuan? Kami siap membantu</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <HelpCircle className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-1">FAQ</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Pertanyaan umum
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/faq">Lihat FAQ</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-1">Panduan</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Cara penggunaan
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/support">Baca Panduan</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="font-bold mb-1">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Chat langsung
                </p>
                <Button variant="gradient" size="sm">
                  Mulai Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* My Tickets */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Tiket Saya</h3>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setShowForm(!showForm)}
                >
                  Buat Tiket
                </Button>
              </div>

              {showForm && (
                <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-3">Tiket Baru</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Subjek</label>
                      <Input
                        placeholder="Subjek pertanyaan Anda"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>
                    <Button variant="gradient" className="gap-2">
                      <Send className="w-4 h-4" />
                      Kirim Tiket
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {myTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-muted-foreground">
                          {ticket.id}
                        </span>
                        <Badge
                          className={
                            ticket.status === "open"
                              ? "bg-primary/20 text-primary"
                              : "bg-accent/20 text-accent"
                          }
                        >
                          {ticket.status === "open" ? (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Open
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolved
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ticket.date).toLocaleDateString("id-ID")} •
                        Balasan terakhir: {ticket.lastReply}
                      </p>
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
              <Button variant="gradient" className="w-full">
                Hubungi Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
