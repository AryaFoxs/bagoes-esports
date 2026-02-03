import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
import { ArticleCard } from "@/components/blog/ArticleCard";
import type { Article } from "@/types";

interface NewsSectionProps {
  latestArticles: Article[];
}

export function NewsSection({ latestArticles }: NewsSectionProps) {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Berita
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Berita <span className="gradient-text">Terkini</span>
            </h2>
            <p className="text-muted-foreground">
              Update terbaru dari dunia esports Indonesia
            </p>
          </div>
          <Button variant="ghost" asChild className="mt-4 md:mt-0">
            <Link href="/blog" className="gap-2">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
