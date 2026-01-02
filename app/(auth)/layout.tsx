import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-2xl">
              <span className="gradient-text">Bagoes</span> Esports
            </span>
          </Link>
          
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">
              Bergabung dengan Komunitas Esports Terbesar
            </h2>
            <p className="text-muted-foreground">
              Kelola turnamen, bangun tim, dan raih kemenangan bersama ribuan
              gamers profesional di Indonesia.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">25K+</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">350+</div>
              <div className="text-sm text-muted-foreground">Tim</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">150+</div>
              <div className="text-sm text-muted-foreground">Event</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text">Bagoes</span> Esports
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
