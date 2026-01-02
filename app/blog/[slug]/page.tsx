import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/data";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  BookOpen,
  ArrowRight,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Artikel tidak ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            Artikel yang Anda cari tidak ada atau sudah dihapus.
          </p>
          <Button asChild>
            <Link href="/blog">Kembali ke Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "news":
        return "Berita";
      case "tips":
        return "Tips & Trik";
      case "analysis":
        return "Analisis";
      case "community":
        return "Komunitas";
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </Link>
          </Button>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="capitalize">
                {getCategoryLabel(article.category)}
              </Badge>
              {article.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {article.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {article.author.name}
                  </p>
                  <p className="text-xs">Penulis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-ul:text-muted-foreground prose-li:marker:text-primary
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-semibold mb-4">Bagikan Artikel</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Tentang Penulis</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium">{article.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Penulis Esports
                      </p>
                    </div>
                  </div>
                  {article.author.bio && (
                    <p className="text-sm text-muted-foreground">
                      {article.author.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-card/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl font-bold">Artikel Terkait</h2>
              <Button variant="ghost" asChild>
                <Link href="/blog" className="gap-2">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((relArticle) => (
                <Card key={relArticle.id} hover className="overflow-hidden group">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    <Badge className="absolute top-3 left-3 capitalize">
                      {getCategoryLabel(relArticle.category)}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/blog/${relArticle.slug}`}>
                        {relArticle.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{relArticle.author.name}</span>
                      <span>•</span>
                      <span>{relArticle.readTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
