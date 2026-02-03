import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 gradient-primary opacity-90" />
          <div className="absolute inset-0 bg-grid opacity-20" />

          <div className="relative p-8 md:p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Siap Menjadi Juara?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Bergabunglah bersama ribuan gamers Indonesia dan mulai
              perjalanan esports-mu sekarang!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                asChild
              >
                <Link href="/register" className="gap-2">
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/kontak">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
