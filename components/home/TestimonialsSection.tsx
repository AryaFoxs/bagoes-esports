import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 lg:py-32 bg-card/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Quote className="w-3 h-3 mr-1" />
            Testimoni
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Kata Mereka tentang <span className="gradient-text">Bagoes Esports</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman dari para pemain dan penyelenggara event
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
