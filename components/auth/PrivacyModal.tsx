import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🔒 Kebijakan Privasi
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Terakhir diperbarui: 1 Januari 2026</p>
          
          <h4 className="font-bold text-foreground">1. Informasi yang Kami Kumpulkan</h4>
          <p>
            Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, email, dan informasi profil. Kami juga mengumpulkan data penggunaan secara otomatis.
          </p>
          
          <h4 className="font-bold text-foreground">2. Penggunaan Informasi</h4>
          <p>
            Informasi Anda digunakan untuk menyediakan layanan, mengirim notifikasi, meningkatkan pengalaman pengguna, dan berkomunikasi dengan Anda.
          </p>
          
          <h4 className="font-bold text-foreground">3. Berbagi Informasi</h4>
          <p>
            Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Informasi hanya dibagikan dengan penyedia layanan yang membantu operasional kami.
          </p>
          
          <h4 className="font-bold text-foreground">4. Keamanan Data</h4>
          <p>
            Kami menerapkan langkah-langkah keamanan untuk melindungi informasi pribadi Anda dari akses, perubahan, atau pengungkapan yang tidak sah.
          </p>
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/privacy">
                <ExternalLink className="w-4 h-4" />
                Baca Selengkapnya
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
