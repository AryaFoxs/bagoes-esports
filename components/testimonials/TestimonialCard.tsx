import { Card, CardContent } from "@/components/ui/card";
import { Quote, Users, Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="relative">
      <CardContent className="p-6">
        <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            {testimonial.avatar ? (
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Users className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-xs text-muted-foreground">
              {testimonial.role}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          "{testimonial.content}"
        </p>
        <div className="flex gap-1 mt-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-accent text-accent"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
