import kopiFamilyAsset from "@/assets/kopi-family.jpg.asset.json";
import kopiKrewengAsset from "@/assets/kopi-kreweng.jpg.asset.json";
import kopiFatimaAsset from "@/assets/kopi-fatima.jpg.asset.json";
import secangkirAsset from "@/assets/secangkir.jpg.asset.json";
import tasAnyamanAsset from "@/assets/tas-anyaman.jpg.asset.json";
import kreweng7010 from "@/assets/kreweng-7010.mp4.asset.json";
import kreweng7011 from "@/assets/kreweng-7011.mp4.asset.json";
import kreweng7012 from "@/assets/kreweng-7012.mp4.asset.json";
import kreweng7013 from "@/assets/kreweng-7013.mp4.asset.json";
import kreweng7014 from "@/assets/kreweng-7014.mp4.asset.json";
import kreweng7015 from "@/assets/kreweng-7015.mp4.asset.json";
import kreweng7017 from "@/assets/kreweng-7017.mp4.asset.json";
import kreweng7009Poster from "@/assets/kreweng-7009-poster.jpg.asset.json";
import kreweng7010Poster from "@/assets/kreweng-7010-poster.jpg.asset.json";
import kreweng7011Poster from "@/assets/kreweng-7011-poster.jpg.asset.json";
import kreweng7012Poster from "@/assets/kreweng-7012-poster.jpg.asset.json";
import kreweng7013Poster from "@/assets/kreweng-7013-poster.jpg.asset.json";
import kreweng7014Poster from "@/assets/kreweng-7014-poster.jpg.asset.json";
import kreweng7015Poster from "@/assets/kreweng-7015-poster.jpg.asset.json";
import kreweng7017Poster from "@/assets/kreweng-7017-poster.jpg.asset.json";
import heroImage from "@/assets/klepu-hero.jpg";

export type Category = "Kopi" | "Herbal" | "Makanan" | "Kerajinan" | "Kuliner";

export interface BusinessFact {
  label: string;
  value: string;
}

export interface Opportunity {
  name: string;
  investment: string;
  detail: string;
}

export interface Umkm {
  id: string;
  slug: string;
  name: string;
  owner: string;
  category: Category;
  product: string;
  summary: string;
  image: string;
  imageAlt: string;
  activeStatus: string;
  readiness: string;
  investment: string;
  investmentUse: string[];
  market: string;
  opportunityContext: string;
  opportunities: Opportunity[];
  risks: string[];
  mitigations: string[];
  prerequisites: string[];
  facts: BusinessFact[];
  operations?: BusinessFact[];
  roles?: BusinessFact[];
  gaps?: string[];
  priority?: string;
  potentials?: string[];
  videos?: { src: string; poster: string }[];
  description?: string;
  price?: string;
  whatsapp?: string;
  mapsUrl?: string;
}

const LAPAK_WHATSAPP = "https://api.whatsapp.com/send?phone=+6281216022043";
const LAPAK_MAPS = "https://www.google.com/maps?q=-7.922506701004813,111.65794009342791";

const coffeeShared = {
  readiness: "Siap bersyarat",
  investment: "Rp20–28 juta",
  investmentUse: ["Mesin sangrai", "Grinder", "Sealer dan kemasan", "Modal kerja awal"],
  market: "Wisatawan, toko, kios Goa Maria, pusat oleh-oleh, reseller, dan kanal daring.",
  opportunityContext: "Pengembangan produk turunan dari Kopi Liberika Klepu yang bisa dijalankan dari usaha ini.",
  risks: ["Kontinuitas pasokan kopi", "Konsistensi mutu sangrai", "Perubahan harga dan penjualan"],
  mitigations: ["Pemasok tetap", "SOP produksi", "Komitmen pembelian", "Diversifikasi produk"],
  prerequisites: ["HPP terverifikasi", "Catatan penjualan", "Dokumen izin", "Penawaran harga alat"],
  operations: [
    { label: "Bahan baku", value: "Kopi Liberika dari petani Desa Klepu (nama pemasok dan volume masih didata)" },
    { label: "Kebutuhan alat", value: "Mesin sangrai (roaster), grinder, sealer, dan kemasan" },
    { label: "Model investasi", value: "Alat bersama antar-UMKM kopi atau pembiayaan bertahap" },
    { label: "Kanal penjualan", value: "Toko, kios Goa Maria, pusat oleh-oleh, dan pemesanan langsung" },
    { label: "Legalitas", value: "Status izin masih dalam pemeriksaan dokumen" },
  ],
  roles: [
    { label: "Pelaksana utama", value: "UMKM kopi bersama petani kopi Klepu" },
    { label: "Pokdarwis Jayandaru", value: "Promosi lewat jalur wisata desa" },
    { label: "BUMDes / Pemerintah Desa", value: "Pengadaan mesin bersama dan fasilitasi" },
  ],
  gaps: ["HPP per kemasan", "Catatan penjualan historis", "Bukti dokumen izin", "Data volume pasokan kopi"],
  priority: "Prioritas 1 dari 8 peluang desa — produk dan pasarnya sudah tersedia.",
  potentials: ["POT-001 Kopi Liberika — kebun Klepu / Banyu Putih (terkonfirmasi sebagian)"],
};

const coffeeOpportunities: Opportunity[] = [
  { name: "Drip bag kopi", investment: "Rp6–12 juta", detail: "Kemasan sekali seduh untuk wisatawan dan pengiriman antarkota." },
  { name: "Kopi kemasan premium", investment: "Rp8–15 juta", detail: "Ukuran 100 g dan 250 g dengan label, tanggal sangrai, dan profil rasa." },
  { name: "Paket oleh-oleh kopi", investment: "Rp5–12 juta", detail: "Kopi digabung camilan desa sebagai satu paket suvenir." },
  { name: "Wisata kopi", investment: "Rp15–30 juta", detail: "Kunjungan kebun, sangrai, dan seduh bersama untuk rombongan wisata." },
];

export const umkmList: Umkm[] = [
  {
    id: "UMKM-001",
    slug: "kopi-family",
    name: "Kopi Family",
    owner: "Muji",
    category: "Kopi",
    product: "Kopi Family 150 gram",
    summary: "Kopi Liberika rumahan dengan pasar wisata dan oleh-oleh yang sudah terbentuk.",
    image: kopiFamilyAsset.url,
    imageAlt: "Kemasan produk Kopi Family dari Desa Klepu",
    activeStatus: "Aktif",
    ...coffeeShared,
    opportunities: coffeeOpportunities,
    description: "Kopi Family adalah kopi yang terbuat dari kopi liberika asli pegunungan Banyu Putih Klepu yang dirawat menggunakan pupuk organik. Tersedia kemasan 50 gram dan 150 gram.",
    price: "Rp7.500 (50 g) · Rp17.000 (150 g)",
    whatsapp: `${LAPAK_WHATSAPP}&text=Saya%20ingin%20membeli%20Kopi%20Family%20yang%20anda%20tawarkan%20di%20Lapak%20Desa`,
    mapsUrl: LAPAK_MAPS,
    facts: [
      { label: "Harga produk", value: "Rp17.000 per 150 gram" },
      { label: "Penjualan", value: "15 kemasan per minggu (sekitar 65 kemasan per bulan)" },
      { label: "Pesanan terbesar", value: "30 kemasan dalam satu pemesanan" },
      { label: "Tenaga kerja", value: "5 orang" },
      { label: "Tempat produksi", value: "Rumah tangga" },
      { label: "Proses produksi", value: "Sekitar 3 hari per siklus" },
      { label: "Digital", value: "WhatsApp dan Shopee; tautan belum dicatat" },
    ],
    operations: [
      { label: "Bahan baku", value: "Kopi Liberika dari petani Desa Klepu; nama pemasok dan volume masih didata" },
      { label: "Mesin yang sudah dimiliki", value: "Mesin pengupas dan pembersih kulit kopi" },
      { label: "Kebutuhan alat", value: "Mesin sangrai dan pelatihan penggunaannya" },
      { label: "Distribusi", value: "Diantar sendiri dengan kendaraan milik usaha" },
      { label: "Kanal penjualan", value: "Wisatawan, toko, kios Goa Maria, dan pusat oleh-oleh" },
      { label: "Legalitas", value: "NIB dinyatakan tersedia; dokumen masih perlu ditunjukkan" },
    ],
  },
  {
    id: "UMKM-002",
    slug: "kopi-kreweng",
    name: "Kopi Kreweng",
    owner: "Binti Ziananingrum",
    category: "Kopi",
    product: "Kopi bubuk Liberika",
    summary: "Produk kopi lokal aktif yang berpeluang tumbuh melalui alat bersama dan kemasan yang lebih kuat.",
    image: kopiKrewengAsset.url,
    imageAlt: "Kemasan produk Kopi Kreweng dari Desa Klepu",
    activeStatus: "Aktif",
    ...coffeeShared,
    opportunities: coffeeOpportunities,
    videos: [
      { src: kreweng7010.url, poster: kreweng7010Poster.url },
      { src: kreweng7011.url, poster: kreweng7011Poster.url },
      { src: kreweng7012.url, poster: kreweng7012Poster.url },
      { src: kreweng7013.url, poster: kreweng7013Poster.url },
      { src: kreweng7014.url, poster: kreweng7014Poster.url },
      { src: kreweng7015.url, poster: kreweng7015Poster.url },
      { src: kreweng7017.url, poster: kreweng7017Poster.url },
    ],
    description: "Kopi Kreweng merupakan kopi yang diolah secara manual dari petik, pengupasan, pengeringan, bahkan digoreng menggunakan kreweng (wajan tanah liat). Berat: 200 gram.",
    price: "Rp17.000 (200 g)",
    whatsapp: `${LAPAK_WHATSAPP}&text=Saya%20ingin%20membeli%20Kopi%20Kreweng%20yang%20anda%20tawarkan%20di%20Lapak%20Desa`,
    mapsUrl: LAPAK_MAPS,
    facts: [
      { label: "Komoditas", value: "Kopi Liberika Klepu" },
      { label: "Pemilik", value: "Binti Ziananingrum" },
      { label: "Kapasitas", value: "Belum tersedia" },
      { label: "Model investasi", value: "Alat bersama atau pembiayaan bertahap" },
    ],
  },
  {
    id: "UMKM-003",
    slug: "kopi-fatima",
    name: "Kopi Fatima",
    owner: "Binti Ziananingrum",
    category: "Kopi",
    product: "Kopi bubuk Liberika",
    summary: "Produk kopi aktif dalam klaster Liberika Klepu dengan peluang penguatan produksi dan pemasaran.",
    image: kopiFatimaAsset.url,
    imageAlt: "Kemasan produk Kopi Fatima dari Desa Klepu",
    activeStatus: "Aktif",
    ...coffeeShared,
    opportunities: coffeeOpportunities,
    description: "Kopi Fatima adalah kopi yang terbuat dari kopi berjenis liberika dan diproduksi secara murni tanpa campuran apapun. Berat: 200 gram.",
    price: "Rp40.000 (200 g)",
    whatsapp: `${LAPAK_WHATSAPP}&text=Saya%20ingin%20membeli%20Kopi%20Fatima%20yang%20anda%20tawarkan%20di%20Lapak%20Desa`,
    mapsUrl: LAPAK_MAPS,
    facts: [
      { label: "Komoditas", value: "Kopi Liberika Klepu" },
      { label: "Status usaha", value: "Aktif" },
      { label: "Kapasitas", value: "Belum tersedia" },
      { label: "Pengembangan", value: "Kopi bubuk, drip bag, dan paket wisata kopi" },
    ],
  },
  {
    id: "UMKM-004",
    slug: "secangkir",
    name: "Secangkir / Secangker",
    owner: "Binti Ziananingrum",
    category: "Herbal",
    product: "Teh kelor–secang",
    summary: "Minuman herbal berbahan daun kelor dan kayu secang dengan peluang peningkatan proses dan legalitas.",
    image: secangkirAsset.url,
    imageAlt: "Produk teh kelor dan secang dari Desa Klepu",
    activeStatus: "Aktif",
    readiness: "Perlu penguatan",
    investment: "Rp10–20 juta",
    investmentUse: ["Pengering", "Grinder", "Alat pengemas", "Pengurusan izin"],
    market: "Pasar oleh-oleh dan minuman herbal; data penjualan belum tersedia.",
    opportunityContext: "Pengembangan lanjutan dari produk teh kelor–secang yang sudah dibuat.",
    opportunities: [
      { name: "Teh celup kelor–secang", investment: "Rp8–15 juta", detail: "Kemasan celup agar lebih praktis dan tahan simpan." },
      { name: "Minuman siap seduh botolan", investment: "Rp12–20 juta", detail: "Varian seduh dingin untuk kedai dan titik wisata." },
      { name: "Paket oleh-oleh herbal", investment: "Rp5–12 juta", detail: "Kotak isi teh kelor, secang, dan camilan desa." },
      { name: "Kebun kelor mitra", investment: "Rp6–12 juta", detail: "Penanaman kelor bersama warga agar pasokan bahan stabil." },
    ],
    risks: ["Sumber bahan belum tercatat", "HPP belum tersedia", "Legalitas dan masa simpan belum lengkap"],
    mitigations: ["Pendataan pemasok", "Uji masa simpan", "Pendampingan izin", "Pencatatan biaya produksi"],
    prerequisites: ["Berat dan isi produk", "Kapasitas produksi", "HPP", "Bukti izin"],
    description: "Secangker adalah minuman herbal yang menggabungkan khasiat daun kelor dan pohon secang dalam bentuk teh celup.",
    price: "Rp11.000",
    whatsapp: `${LAPAK_WHATSAPP}&text=Saya%20ingin%20membeli%20Secangkir%20yang%20anda%20tawarkan%20di%20Lapak%20Desa`,
    mapsUrl: LAPAK_MAPS,
    facts: [
      { label: "Harga", value: "Rp11.000" },
      { label: "Bahan", value: "Daun kelor dan kayu secang" },
      { label: "Bentuk produk", value: "Teh celup siap seduh" },
      { label: "Pasokan bahan", value: "Pemasok belum terdata" },
      { label: "Kapasitas dan penjualan", value: "Belum tersedia" },
      { label: "Penilaian kesiapan", value: "Perlu pendampingan" },
    ],
    operations: [
      { label: "Bahan baku", value: "Daun kelor (POT-010) dan kayu secang (POT-011); bahan terkonfirmasi, pemasok belum terdata" },
      { label: "Kebutuhan alat", value: "Pengering, grinder, dan alat pengemas" },
      { label: "Legalitas", value: "Izin edar, komposisi, dan masa simpan masih dalam pendampingan" },
      { label: "Kanal penjualan", value: "Pasar oleh-oleh dan minuman herbal" },
    ],
    roles: [
      { label: "Pelaksana utama", value: "UMKM herbal Desa Klepu" },
      { label: "Pokdarwis Jayandaru", value: "Promosi produk ke pengunjung desa" },
      { label: "BUMDes / Pemerintah Desa", value: "Pendampingan pengurusan izin" },
    ],
    gaps: ["Kapasitas produksi", "Dokumen izin", "Komposisi dan masa simpan", "Data pasar"],
    priority: "Prioritas 4 dari 8 peluang desa — produksi dan legalitas masih perlu dilengkapi.",
    potentials: ["POT-010 Daun kelor — bahan terkonfirmasi", "POT-011 Kayu secang — bahan terkonfirmasi"],
  },
  {
    id: "UMKM-005",
    slug: "keripik-tempe",
    name: "Keripik Tempe Ibu Ros",
    owner: "Ibu Ros",
    category: "Makanan",
    product: "Keripik tempe",
    summary: "Usaha sejak sekitar 2014 dengan produksi rutin dan kebutuhan alat yang sudah teridentifikasi.",
    image: heroImage,
    imageAlt: "Keripik tempe sebagai salah satu produk unggulan Desa Klepu",
    activeStatus: "Aktif",
    readiness: "Relatif prospektif",
    investment: "Rp8–15 juta",
    investmentUse: ["Pemotong", "Peniris minyak", "Sealer", "Kemasan"],
    market: "Permintaan telah terbentuk melalui toko dan pembeli eceran.",
    opportunityContext: "Pengembangan produk turunan dari keripik tempe yang sudah diproduksi rutin.",
    opportunities: [
      { name: "Varian rasa keripik", investment: "Rp4–8 juta", detail: "Rasa pedas, balado, dan original dalam kemasan berbeda." },
      { name: "Kemasan toples oleh-oleh", investment: "Rp5–10 juta", detail: "Ukuran besar untuk pusat oleh-oleh dan pemesanan acara." },
      { name: "Penjualan daring", investment: "Rp3–6 juta", detail: "Foto produk, kemasan aman kirim, dan toko di marketplace." },
      { name: "Kapasitas produksi ganda", investment: "Rp10–18 juta", detail: "Pemotong dan peniris tambahan untuk melipatgandakan hasil." },
    ],
    risks: ["Kapasitas manual", "Mutu hasil penggorengan", "Dokumen legalitas belum diperiksa"],
    mitigations: ["Peralatan terukur", "SOP produksi", "Verifikasi dokumen", "Kemasan lebih konsisten"],
    prerequisites: ["HPP", "Catatan penjualan", "Bukti NIB/PIRT/halal", "Penawaran alat"],
    facts: [
      { label: "Mulai usaha", value: "Sekitar 2014" },
      { label: "Hasil per proses", value: "120–125 kemasan" },
      { label: "Frekuensi", value: "Sekitar dua kali seminggu" },
      { label: "Harga", value: "Rp4.000 toko; Rp4.500–5.000 eceran" },
      { label: "Tenaga kerja", value: "Pemilik dan satu orang" },
      { label: "Produksi bulanan", value: "Sekitar 960–1.000 kemasan" },
      { label: "Penilaian kesiapan", value: "Siap bersyarat" },
    ],
    operations: [
      { label: "Bahan baku", value: "Kedelai/tempe dari agen Sombro (terkonfirmasi)" },
      { label: "Pemakaian bahan", value: "4–4,5 kg per sekali produksi" },
      { label: "Kebutuhan alat", value: "Pemotong, peniris minyak, sealer, dan kemasan" },
      { label: "Kanal penjualan", value: "Toko titipan dan pembeli eceran" },
      { label: "Legalitas", value: "NIB, PIRT, dan halal masih perlu diperiksa dokumennya" },
    ],
    roles: [
      { label: "Pelaksana utama", value: "UMKM Ibu Ros" },
      { label: "Pokdarwis Jayandaru", value: "Pemasaran sebagai oleh-oleh desa" },
      { label: "BUMDes / Pemerintah Desa", value: "Distribusi, bantuan alat, dan pengurusan izin" },
    ],
    gaps: ["Catatan keuangan usaha", "Data tenaga kerja", "Penawaran harga alat"],
    priority: "Prioritas 2 dari 8 peluang desa — produksi dan permintaan sudah terbentuk.",
    potentials: ["POT-012 Kedelai/tempe — agen Sombro (terkonfirmasi)"],
  },
  {
    id: "UMKM-006",
    slug: "tas-anyaman-plastik",
    name: "Tas Anyaman Plastik",
    owner: "Binti Ziananingrum",
    category: "Kerajinan",
    product: "Tas anyaman",
    summary: "Kerajinan aktif yang dapat dikembangkan sebagai suvenir dan bagian dari paket wisata desa.",
    image: tasAnyamanAsset.url,
    imageAlt: "Tas anyaman plastik buatan pengrajin Desa Klepu",
    activeStatus: "Aktif",
    readiness: "Perlu penguatan",
    investment: "Rp5–10 juta",
    investmentUse: ["Bahan", "Peralatan", "Pengembangan desain", "Kemasan"],
    market: "Wisatawan, paket suvenir, dan pemasaran oleh Pokdarwis.",
    opportunityContext: "Pengembangan lini produk anyaman dari keterampilan pengrajin yang sudah ada.",
    opportunities: [
      { name: "Suvenir anyaman kecil", investment: "Rp3–6 juta", detail: "Dompet, tempat tisu, dan gantungan untuk harga terjangkau." },
      { name: "Katalog desain baru", investment: "Rp4–8 juta", detail: "Variasi ukuran, warna, dan motif khas Klepu." },
      { name: "Pesanan merchandise", investment: "Rp5–10 juta", detail: "Tas berlogo untuk instansi, acara desa, dan wisata rombongan." },
      { name: "Kelas anyaman wisata", investment: "Rp6–12 juta", detail: "Pengalaman membuat anyaman bagi pengunjung desa." },
    ],
    risks: ["Kapasitas belum diketahui", "Rincian bahan dan biaya belum tersedia", "Pasar belum terdokumentasi"],
    mitigations: ["Pendataan waktu kerja", "Katalog ukuran dan warna", "Kurasi suvenir", "Uji pasar wisata"],
    prerequisites: ["Profil pengrajin", "Kapasitas", "Biaya produksi", "Data pasar"],
    description: "Tas anyaman plastik yang dibuat secara teliti sehingga menghasilkan produk yang elegan. Dibuat langsung oleh pengrajin.",
    price: "Rp45.000",
    whatsapp: `${LAPAK_WHATSAPP}&text=Saya%20ingin%20membeli%20Tas%20Anyaman%20Plastik%20yang%20anda%20tawarkan%20di%20Lapak%20Desa`,
    mapsUrl: LAPAK_MAPS,
    facts: [
      { label: "Harga", value: "Rp45.000" },
      { label: "Pembuat", value: "Pengrajin lokal" },
      { label: "Pemilik", value: "Pengrajin lokal" },
      { label: "Kapasitas", value: "Belum tersedia" },
    ],
  },
  {
    id: "UMKM-007",
    slug: "kedai-lungguh",
    name: "Kedai Lungguh",
    owner: "Pengelola Lokal",
    category: "Kuliner",
    product: "Kuliner lokal",
    summary: "Kedai aktif yang berpotensi terhubung dengan wisata dan paket oleh-oleh Desa Klepu.",
    image: heroImage,
    imageAlt: "Ragam hasil usaha lokal Desa Klepu",
    activeStatus: "Aktif",
    readiness: "Data awal",
    investment: "Belum ditetapkan",
    investmentUse: ["Kebutuhan alat belum didata", "Kapasitas belum didata", "Rencana investasi belum divalidasi"],
    market: "Pelanggan kuliner lokal dan potensi pasar wisata.",
    opportunityContext: "Pengembangan layanan kedai sebagai etalase produk kuliner Desa Klepu.",
    opportunities: [
      { name: "Menu kopi Liberika Klepu", investment: "Rp8–15 juta", detail: "Mesin seduh dan menu kopi desa sebagai menu utama kedai." },
      { name: "Sudut oleh-oleh desa", investment: "Rp5–12 juta", detail: "Rak penjualan keripik, teh kelor, dan anyaman warga." },
      { name: "Paket makan rombongan", investment: "Rp6–12 juta", detail: "Menu dan peralatan saji untuk tamu wisata berkelompok." },
      { name: "Area kumpul dan acara", investment: "Rp10–20 juta", detail: "Penataan tempat duduk untuk acara kecil dan pertemuan warga." },
    ],
    risks: ["Profil usaha belum lengkap", "Data produk dan penjualan belum tersedia"],
    mitigations: ["Wawancara pemilik", "Inventarisasi produk", "Pencatatan produksi dan pasar"],
    prerequisites: ["Pendataan pemilik", "Daftar produk", "Kapasitas", "Kebutuhan dana"],
    facts: [
      { label: "Bidang", value: "Kuliner" },
      { label: "Status usaha", value: "Aktif" },
      { label: "Pemilik", value: "Pengelola Lokal" },
      { label: "Rencana investasi", value: "Belum disusun" },
    ],
  },
];

export function getUmkm(slug: string) {
  return umkmList.find((item) => item.slug === slug);
}
