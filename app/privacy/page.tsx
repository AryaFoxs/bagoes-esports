import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Kebijakan Privasi | Bagoes Esports",
  description: "Kebijakan Privasi dan perlindungan data pengguna Bagoes Esports",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Kebijakan <span className="gradient-text">Privasi</span>
            </h1>
            <p className="text-muted-foreground">
              Terakhir diperbarui: 1 Januari 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kami mengumpulkan berbagai jenis informasi untuk menyediakan dan meningkatkan Layanan kami:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">Informasi yang Anda Berikan</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                <li>Nama lengkap dan username</li>
                <li>Alamat email</li>
                <li>Foto profil dan avatar</li>
                <li>Informasi tim dan game yang dimainkan</li>
                <li>Konten yang Anda unggah (post, komentar, media)</li>
                <li>Informasi pembayaran (diproses oleh payment provider)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">Informasi yang Dikumpulkan Otomatis</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Alamat IP dan lokasi umum</li>
                <li>Jenis perangkat dan browser</li>
                <li>Halaman yang dikunjungi dan waktu kunjungan</li>
                <li>Cookies dan teknologi pelacakan serupa</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. Penggunaan Informasi</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Menyediakan, mengoperasikan, dan memelihara Layanan</li>
                <li>Memproses pendaftaran turnamen dan transaksi</li>
                <li>Mengirim notifikasi tentang event, tim, dan aktivitas akun</li>
                <li>Meningkatkan dan mempersonalisasi pengalaman pengguna</li>
                <li>Menganalisis penggunaan untuk pengembangan produk</li>
                <li>Mencegah penipuan dan meningkatkan keamanan</li>
                <li>Berkomunikasi dengan Anda tentang update dan promosi</li>
                <li>Mematuhi kewajiban hukum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Berbagi Informasi</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kami TIDAK menjual informasi pribadi Anda kepada pihak ketiga. Informasi Anda mungkin dibagikan dengan:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Penyedia Layanan:</strong> Partner yang membantu operasional (hosting, payment gateway, analytics)</li>
                <li><strong>Pengguna Lain:</strong> Informasi profil publik yang Anda pilih untuk ditampilkan</li>
                <li><strong>Tim dan Turnamen:</strong> Informasi yang diperlukan untuk partisipasi</li>
                <li><strong>Pihak Berwenang:</strong> Jika diwajibkan oleh hukum atau untuk melindungi keamanan</li>
                <li><strong>Transfer Bisnis:</strong> Dalam hal merger, akuisisi, atau penjualan aset</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Cookies dan Teknologi Pelacakan</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kami menggunakan cookies dan teknologi serupa untuk:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Mengingat preferensi dan pengaturan Anda</li>
                <li>Menjaga Anda tetap login</li>
                <li>Memahami bagaimana Anda menggunakan Layanan</li>
                <li>Menampilkan konten yang relevan</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Anda dapat mengontrol cookies melalui pengaturan browser Anda, namun beberapa fitur mungkin tidak berfungsi dengan baik jika cookies dinonaktifkan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Keamanan Data</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kami menerapkan langkah-langkah keamanan untuk melindungi informasi Anda:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Enkripsi data saat transit (HTTPS/SSL)</li>
                <li>Penyimpanan password yang di-hash</li>
                <li>Akses terbatas ke data pribadi</li>
                <li>Monitoring keamanan reguler</li>
                <li>Backup data terenkripsi</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Meskipun demikian, tidak ada metode transmisi atau penyimpanan yang 100% aman. Kami tidak dapat menjamin keamanan absolut.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Retensi Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami menyimpan informasi Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan Layanan. Setelah penghapusan akun, kami akan menghapus atau menganonimkan data Anda dalam waktu 30 hari, kecuali diperlukan oleh hukum untuk mempertahankannya lebih lama.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Hak Anda</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Anda memiliki hak untuk:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Mengakses:</strong> Meminta salinan data pribadi Anda</li>
                <li><strong>Memperbaiki:</strong> Memperbarui informasi yang tidak akurat</li>
                <li><strong>Menghapus:</strong> Meminta penghapusan akun dan data</li>
                <li><strong>Menolak:</strong> Opt-out dari komunikasi pemasaran</li>
                <li><strong>Portabilitas:</strong> Meminta data Anda dalam format terstruktur</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Untuk menggunakan hak-hak ini, hubungi kami melalui halaman Pengaturan atau email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Privasi Anak</h2>
              <p className="text-muted-foreground leading-relaxed">
                Layanan kami tidak ditujukan untuk anak-anak di bawah 13 tahun. Kami tidak secara sengaja mengumpulkan informasi dari anak-anak di bawah 13 tahun. Jika Anda adalah orang tua dan mengetahui anak Anda telah memberikan informasi kepada kami, silakan hubungi kami untuk mengatur penghapusan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Transfer Data Internasional</h2>
              <p className="text-muted-foreground leading-relaxed">
                Data Anda mungkin ditransfer dan diproses di server yang berlokasi di luar Indonesia. Kami memastikan bahwa transfer tersebut dilakukan sesuai dengan hukum perlindungan data yang berlaku dan dengan perlindungan yang memadai.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Pembaruan Kebijakan</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform. Penggunaan berkelanjutan atas Layanan setelah perubahan berarti Anda menerima kebijakan yang diperbarui.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Hubungi Kami</h2>
              <p className="text-muted-foreground leading-relaxed">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau praktik data kami, silakan hubungi:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Email: privacy@bagoesesports.com</li>
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
