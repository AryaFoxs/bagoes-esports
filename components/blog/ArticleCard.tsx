import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card hover className="overflow-hidden group">
      <div className="aspect-video bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Star className="w-12 h-12 text-white/60" />
        </div>
        {article.image && (
          <img 
            src={article.image} 
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <Badge className="absolute top-3 left-3 capitalize">
          {article.category}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{article.author.name}</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
        </div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
      </CardContent>
    </Card>
  );
}
