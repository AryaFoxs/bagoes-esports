import Image from "next/image";
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
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/logo.png"
                alt="Bagoes Esports Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-2xl tracking-tight uppercase">
                <span className="gradient-text">Bagoes</span>
                <span className="text-foreground"> Esports</span>
              </span>
              <span className="text-xs font-normal text-muted-foreground uppercase" style={{ letterSpacing: '0.3em' }}>Organizer</span>
            </div>
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
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Bagoes Esports Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-xl tracking-tight uppercase">
                  <span className="gradient-text">Bagoes</span>
                  <span className="text-foreground"> Esports</span>
                </span>
                <span className="text-[10px] font-normal text-muted-foreground uppercase" style={{ letterSpacing: '0.25em' }}>Organizer</span>
              </div>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
