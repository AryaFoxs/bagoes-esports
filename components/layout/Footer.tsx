import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Home", href: "/" },
    { label: "Event", href: "/event" },
    { label: "Turnamen", href: "/turnamen" },
    { label: "Blog", href: "/blog" },
  ],
  komunitas: [
    { label: "Forum", href: "/komunitas" },
    { label: "Tim Esports", href: "/tim" },
    { label: "Leaderboard", href: "/turnamen#leaderboard" },
    { label: "Rekrutmen", href: "/tim#rekrutmen" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Support Center", href: "/support" },
    { label: "Kontak", href: "/kontak" },
    { label: "Kebijakan Privasi", href: "/privacy" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/bagoesesports", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/bagoesesports", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@bagoesesports", label: "YouTube" },
  { icon: MessageCircle, href: "https://discord.gg/bagoesesports", label: "Discord" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 group mb-4"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
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
                <span className="text-xs font-normal text-muted-foreground uppercase" style={{ letterSpacing: '0.3em' }}>Organizer</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Platform esports terdepan untuk mengelola event, turnamen, dan
              komunitas gaming di Indonesia. Bergabunglah dengan ribuan gamers
              dan tim esports profesional.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@bagoesesports.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Komunitas</h4>
            <ul className="space-y-2">
              {footerLinks.komunitas.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Dukungan</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-lg mb-1">Stay Updated</h4>
              <p className="text-sm text-muted-foreground">
                Dapatkan info terbaru tentang event dan turnamen esports.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Email kamu..."
                className="flex-1 md:w-64 h-11 px-4 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-lg gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Bagoes Esports. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
