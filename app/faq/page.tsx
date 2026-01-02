"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { faqItems } from "@/lib/data";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Trophy,
  Users,
  UserCircle,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";

const categories = [
  { id: "all", label: "Semua", icon: HelpCircle },
  { id: "Turnamen", label: "Turnamen", icon: Trophy },
  { id: "Komunitas", label: "Komunitas", icon: Users },
  { id: "Tim", label: "Tim", icon: UserCircle },
  { id: "Akun", label: "Akun", icon: UserCircle },
  { id: "Support", label: "Support", icon: HeadphonesIcon },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = faqItems.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqItems>);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pertanyaan yang <span className="gradient-text">Sering Diajukan</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Temukan jawaban untuk pertanyaan umum tentang platform kami.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari pertanyaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-y border-border bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {selectedCategory === "all" ? (
              // Grouped by category
              Object.entries(groupedFAQs).map(([category, faqs]) => (
                <div key={category} className="mb-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </span>
                    {category}
                  </h2>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <Card
                        key={faq.id}
                        className={`cursor-pointer transition-all ${
                          openItems.includes(faq.id)
                            ? "border-primary"
                            : "hover:border-muted-foreground/50"
                        }`}
                        onClick={() => toggleItem(faq.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-medium">{faq.question}</h3>
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                            )}
                          </div>
                          {openItems.includes(faq.id) && (
                            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Flat list
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <Card
                    key={faq.id}
                    className={`cursor-pointer transition-all ${
                      openItems.includes(faq.id)
                        ? "border-primary"
                        : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => toggleItem(faq.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-medium">{faq.question}</h3>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      {openItems.includes(faq.id) && (
                        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="text-muted-foreground mb-6">
                  Coba ubah kata kunci pencarian atau kategori.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Masih Butuh Bantuan?
            </h2>
            <p className="text-muted-foreground mb-8">
              Jika Anda tidak menemukan jawaban yang dicari, tim support kami
              siap membantu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/support" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Hubungi Support
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/kontak" className="gap-2">
                  <Mail className="w-5 h-5" />
                  Kirim Email
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
