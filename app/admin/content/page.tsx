"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { FileText, Image, File, ArrowRight, Newspaper, BookOpen } from "lucide-react";

const contentSections = [
  {
    title: "Artikel",
    description: "Kelola blog posts dan artikel",
    icon: FileText,
    href: "/admin/content/articles",
    count: 24,
  },
  {
    title: "Halaman Statis",
    description: "Edit halaman Tentang, FAQ, dll",
    icon: BookOpen,
    href: "/admin/content/pages",
    count: 8,
  },
  {
    title: "Media Library",
    description: "Kelola gambar dan video",
    icon: Image,
    href: "/admin/content/media",
    count: 156,
  },
];

export default function ContentPage() {
  return (
    <div>
      <PageHeader
        title="Manajemen Konten"
        description="Kelola artikel, halaman, dan media website"
        icon={FileText}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Konten" },
        ]}
      />

      <div className="grid md:grid-cols-3 gap-6">
        {contentSections.map((section) => (
          <Card key={section.title} className="group hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-bold text-muted-foreground">
                  {section.count}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {section.description}
              </p>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link href={section.href}>
                  Kelola <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
