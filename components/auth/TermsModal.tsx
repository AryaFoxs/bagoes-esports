import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📜 Syarat & Ketentuan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Terakhir diperbarui: 1 Januari 2026</p>
          
          <h4 className="font-bold text-foreground">1. Penerimaan Ketentuan</h4>
          <p>
            Dengan mengakses dan menggunakan layanan Bagoes Esports, Anda setuju untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
          </p>
          
          <h4 className="font-bold text-foreground">2. Penggunaan Layanan</h4>
          <p>
            Anda harus berusia minimal 13 tahun untuk menggunakan layanan ini. Anda bertanggung jawab untuk menjaga kerahasiaan akun Anda dan semua aktivitas yang terjadi di bawah akun Anda.
          </p>
          
          <h4 className="font-bold text-foreground">3. Konten Pengguna</h4>
          <p>
            Anda mempertahankan kepemilikan konten yang Anda unggah, namun Anda memberikan kami lisensi untuk menggunakan, menampilkan, dan mendistribusikan konten tersebut di platform kami.
          </p>
          
          <h4 className="font-bold text-foreground">4. Perilaku yang Dilarang</h4>
          <p>
            Dilarang melakukan tindakan yang melanggar hukum, menyebarkan konten berbahaya, melakukan penipuan, atau mengganggu pengguna lain.
          </p>
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/terms">
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
