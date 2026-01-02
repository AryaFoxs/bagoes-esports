"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
} from "lucide-react";

export default function KontakPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4">
              <Mail className="w-3 h-3 mr-1" />
              Kontak
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hubungi <span className="gradient-text">Kami</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Punya pertanyaan, saran, atau ingin bekerja sama? Jangan ragu
              untuk menghubungi tim kami.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Kirim email kapan saja
                </p>
                <a
                  href="mailto:info@bagoesesports.id"
                  className="text-primary hover:underline"
                >
                  info@bagoesesports.id
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Phone className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-bold mb-2">Telepon</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Senin - Jumat, 09:00 - 17:00
                </p>
                <a
                  href="tel:+6281234567890"
                  className="text-primary hover:underline"
                >
                  +62 812-3456-7890
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Lokasi</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Kantor pusat kami
                </p>
                <p className="text-sm">Jakarta, Indonesia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>

              {isSubmitted ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Pesan Terkirim!</h3>
                    <p className="text-muted-foreground mb-6">
                      Terima kasih telah menghubungi kami. Tim kami akan
                      merespons dalam 1-2 hari kerja.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Kirim Pesan Lain
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Nama Lengkap *
                          </label>
                          <Input placeholder="Masukkan nama Anda" required />
                        </div>
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
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Subjek *
                        </label>
                        <select className="w-full h-11 px-4 rounded-lg border border-border bg-input text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option value="">Pilih subjek...</option>
                          <option value="general">Pertanyaan Umum</option>
                          <option value="event">Kerjasama Event</option>
                          <option value="sponsorship">Sponsorship</option>
                          <option value="technical">Masalah Teknis</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Pesan *
                        </label>
                        <Textarea
                          placeholder="Tulis pesan Anda di sini..."
                          className="min-h-[150px]"
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
                            Kirim Pesan
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map & Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Lokasi Kami</h2>

              {/* Map Placeholder */}
              <Card className="overflow-hidden mb-6">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">
                      Map akan ditampilkan di sini
                    </p>
                  </div>
                </div>
              </Card>

              {/* Office Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Jam Operasional</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Senin - Jumat
                      </span>
                      <span>09:00 - 17:00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sabtu</span>
                      <span>10:00 - 14:00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minggu</span>
                      <span className="text-destructive">Tutup</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Ikuti Kami</h3>
                  <div className="flex gap-2">
                    <a
                      href="https://twitter.com/bagoesesports"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="https://instagram.com/bagoesesports"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://youtube.com/@bagoesesports"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                    <a
                      href="https://discord.gg/bagoesesports"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
