import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Syarat & Ketentuan | Bagoes Esports",
  description: "Syarat dan Ketentuan penggunaan layanan Bagoes Esports",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Syarat & <span className="gradient-text">Ketentuan</span>
            </h1>
            <p className="text-muted-foreground">
              Terakhir diperbarui: 1 Januari 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Penerimaan Ketentuan</h2>
              <p className="text-muted-foreground leading-relaxed">
                Dengan mengakses dan menggunakan layanan Bagoes Esports ("Layanan"), Anda setuju untuk terikat dengan syarat dan ketentuan ini ("Ketentuan"). Jika Anda tidak setuju dengan Ketentuan ini, mohon untuk tidak menggunakan Layanan kami. Kami berhak untuk memperbarui Ketentuan ini kapan saja, dan perubahan akan berlaku segera setelah dipublikasikan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. Penggunaan Layanan</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Untuk menggunakan Layanan kami, Anda harus:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Berusia minimal 13 tahun atau memiliki izin dari orang tua/wali</li>
                <li>Memberikan informasi yang akurat dan lengkap saat mendaftar</li>
                <li>Menjaga kerahasiaan akun dan password Anda</li>
                <li>Bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda</li>
                <li>Segera melaporkan penggunaan tidak sah atas akun Anda</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Konten Pengguna</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Anda mempertahankan kepemilikan atas konten yang Anda unggah ke Layanan kami. Namun, dengan mengunggah konten, Anda memberikan kami lisensi non-eksklusif, bebas royalti, di seluruh dunia untuk:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Menggunakan, menyalin, memodifikasi, dan mendistribusikan konten tersebut</li>
                <li>Menampilkan konten di platform dan channel pemasaran kami</li>
                <li>Membuat karya turunan dari konten Anda</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Anda menyatakan bahwa Anda memiliki hak untuk memberikan lisensi ini dan konten Anda tidak melanggar hak pihak ketiga.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Perilaku yang Dilarang</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Saat menggunakan Layanan, Anda setuju untuk TIDAK:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Melakukan tindakan yang melanggar hukum Indonesia atau hukum internasional</li>
                <li>Menyebarkan konten yang berbahaya, menyinggung, atau tidak pantas</li>
                <li>Menggunakan cheat, exploit, atau bot dalam kompetisi</li>
                <li>Melakukan penipuan atau manipulasi dalam transaksi</li>
                <li>Mengganggu, melecehkan, atau mengancam pengguna lain</li>
                <li>Menyebarkan spam atau konten komersial yang tidak diizinkan</li>
                <li>Mencoba mengakses sistem atau data secara tidak sah</li>
                <li>Membuat akun palsu atau multiple account untuk keuntungan tidak fair</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Turnamen dan Kompetisi</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Untuk partisipasi dalam turnamen dan kompetisi:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Setiap turnamen memiliki aturan spesifik yang harus dipatuhi</li>
                <li>Hadiah akan didistribusikan sesuai ketentuan turnamen</li>
                <li>Kami berhak mendiskualifikasi peserta yang melanggar aturan</li>
                <li>Keputusan admin turnamen bersifat final</li>
                <li>Pendaftaran yang sudah dikonfirmasi tidak dapat dikembalikan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Pembayaran dan Refund</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Untuk transaksi di platform kami:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Semua harga ditampilkan dalam Rupiah Indonesia (IDR)</li>
                <li>Pembayaran harus dilakukan sesuai metode yang tersedia</li>
                <li>Refund diproses sesuai kebijakan masing-masing layanan</li>
                <li>Pembatalan pendaftaran turnamen mengikuti aturan turnamen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Hak Kekayaan Intelektual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Semua konten, logo, desain, dan materi lain di platform Bagoes Esports adalah milik kami atau pemberi lisensi kami dan dilindungi oleh hukum hak cipta dan kekayaan intelektual. Anda tidak diperbolehkan untuk menyalin, memodifikasi, atau mendistribusikan materi tersebut tanpa izin tertulis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Pembatasan Tanggung Jawab</h2>
              <p className="text-muted-foreground leading-relaxed">
                Layanan disediakan "sebagaimana adanya" tanpa jaminan apapun. Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan. Tanggung jawab maksimal kami terbatas pada jumlah yang Anda bayarkan kepada kami dalam 12 bulan terakhir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Penghentian</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami berhak untuk menangguhkan atau menghentikan akses Anda ke Layanan kapan saja, dengan atau tanpa alasan, termasuk jika kami yakin Anda melanggar Ketentuan ini. Setelah penghentian, hak Anda untuk menggunakan Layanan akan segera berakhir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Hukum yang Berlaku</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui negosiasi terlebih dahulu, dan jika tidak berhasil, melalui pengadilan yang berwenang di Indonesia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Hubungi Kami</h2>
              <p className="text-muted-foreground leading-relaxed">
                Jika Anda memiliki pertanyaan tentang Ketentuan ini, silakan hubungi kami melalui:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Email: legal@bagoesesports.com</li>
                <li>Formulir kontak di halaman Bantuan</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
