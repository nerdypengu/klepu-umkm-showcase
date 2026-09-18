import kopiFamilyAsset from "@/assets/kopi-family.jpg.asset.json";
import kopiKrewengAsset from "@/assets/kopi-kreweng.jpg.asset.json";
import kopiFatimaAsset from "@/assets/kopi-fatima.jpg.asset.json";
import secangkirAsset from "@/assets/secangkir.jpg.asset.json";
import tasAnyamanAsset from "@/assets/tas-anyaman.jpg.asset.json";
import heroImage from "@/assets/klepu-hero.jpg";

export type EvidenceStatus = "Faktual" | "Turunan" | "Perlu verifikasi" | "Simulasi" | "Rekomendasi";
export type Category = "Kopi" | "Herbal" | "Makanan" | "Kerajinan" | "Kuliner";

export interface BusinessFact {
  label: string;
  value: string;
  status: EvidenceStatus;
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
  investmentStatus: EvidenceStatus;
  investmentUse: string[];
  market: string;
  risks: string[];
  mitigations: string[];
  prerequisites: string[];
  facts: BusinessFact[];
}

export const evidenceDescriptions: Record<EvidenceStatus, string> = {
  Faktual: "Berasal dari narasumber atau dokumen dan dapat ditampilkan setelah verifikasi.",
  Turunan: "Dihitung dari data faktual dan perlu dibaca bersama periode serta rumusnya.",
  "Perlu verifikasi": "Sudah disebutkan, tetapi bukti atau rinciannya belum lengkap.",
  Simulasi: "Asumsi sementara untuk menguji skenario, bukan hasil aktual.",
  Rekomendasi: "Hasil analisis awal dan belum dianggap sebagai produk atau capaian aktif.",
};

const coffeeShared = {
  readiness: "Siap bersyarat",
  investment: "Rp20–28 juta",
  investmentStatus: "Rekomendasi" as const,
  investmentUse: ["Mesin sangrai", "Grinder", "Sealer dan kemasan", "Modal kerja awal"],
  market: "Wisatawan, toko, kios Goa Maria, pusat oleh-oleh, reseller, dan kanal daring.",
  risks: ["Kontinuitas pasokan kopi", "Konsistensi mutu sangrai", "Perubahan harga dan penjualan"],
  mitigations: ["Pemasok tetap", "SOP produksi", "Komitmen pembelian", "Diversifikasi produk"],
  prerequisites: ["HPP terverifikasi", "Catatan penjualan", "Dokumen izin", "Penawaran harga alat"],
};

export const umkmList: Umkm[] = [
  {
    id: "UMKM-001",
    slug: "kopi-family",
    name: "Kopi Family",
    owner: "Muji — identitas perlu dikonfirmasi",
    category: "Kopi",
    product: "Kopi Family 150 gram",
    summary: "Kopi Liberika rumahan dengan pasar wisata dan oleh-oleh yang sudah terbentuk.",
    image: kopiFamilyAsset.url,
    imageAlt: "Kemasan produk Kopi Family dari Desa Klepu",
    activeStatus: "Aktif; verifikasi identitas",
    ...coffeeShared,
    facts: [
      { label: "Harga produk", value: "Rp17.000 per 150 gram", status: "Faktual" },
      { label: "Penjualan", value: "15 kemasan per minggu", status: "Faktual" },
      { label: "Tenaga kerja", value: "5 orang", status: "Faktual" },
      { label: "Tempat produksi", value: "Rumah tangga", status: "Faktual" },
      { label: "Proses produksi", value: "Sekitar 3 hari", status: "Faktual" },
      { label: "Digital", value: "WhatsApp dan Shopee; tautan belum dicatat", status: "Perlu verifikasi" },
    ],
  },
  {
    id: "UMKM-002",
    slug: "kopi-kreweng",
    name: "Kopi Kreweng",
    owner: "Binti Ziananingrum — menurut katalog",
    category: "Kopi",
    product: "Kopi bubuk Liberika",
    summary: "Produk kopi lokal aktif yang berpeluang tumbuh melalui alat bersama dan kemasan yang lebih kuat.",
    image: kopiKrewengAsset.url,
    imageAlt: "Kemasan produk Kopi Kreweng dari Desa Klepu",
    activeStatus: "Aktif; perlu verifikasi",
    ...coffeeShared,
    facts: [
      { label: "Komoditas", value: "Kopi Liberika Klepu", status: "Faktual" },
      { label: "Pemilik", value: "Binti Ziananingrum menurut katalog", status: "Perlu verifikasi" },
      { label: "Kapasitas", value: "Belum tersedia", status: "Perlu verifikasi" },
      { label: "Model investasi", value: "Alat bersama atau pembiayaan bertahap", status: "Rekomendasi" },
    ],
  },
  {
    id: "UMKM-003",
    slug: "kopi-fatima",
    name: "Kopi Fatima",
    owner: "Binti Ziananingrum — menurut katalog",
    category: "Kopi",
    product: "Kopi bubuk Liberika",
    summary: "Produk kopi aktif dalam klaster Liberika Klepu dengan peluang penguatan produksi dan pemasaran.",
    image: kopiFatimaAsset.url,
    imageAlt: "Kemasan produk Kopi Fatima dari Desa Klepu",
    activeStatus: "Aktif",
    ...coffeeShared,
    facts: [
      { label: "Komoditas", value: "Kopi Liberika Klepu", status: "Faktual" },
      { label: "Status usaha", value: "Aktif", status: "Faktual" },
      { label: "Kapasitas", value: "Belum tersedia", status: "Perlu verifikasi" },
      { label: "Pengembangan", value: "Kopi bubuk, drip bag, dan paket wisata kopi", status: "Rekomendasi" },
    ],
  },
  {
    id: "UMKM-004",
    slug: "secangkir",
    name: "Secangkir / Secangker",
    owner: "Binti Ziananingrum — menurut katalog",
    category: "Herbal",
    product: "Teh kelor–secang",
    summary: "Minuman herbal berbahan daun kelor dan kayu secang dengan peluang peningkatan proses dan legalitas.",
    image: secangkirAsset.url,
    imageAlt: "Produk teh kelor dan secang dari Desa Klepu",
    activeStatus: "Aktif",
    readiness: "Perlu penguatan",
    investment: "Rp10–20 juta",
    investmentStatus: "Rekomendasi",
    investmentUse: ["Pengering", "Grinder", "Alat pengemas", "Pengurusan izin"],
    market: "Pasar oleh-oleh dan minuman herbal; data penjualan belum tersedia.",
    risks: ["Sumber bahan belum tercatat", "HPP belum tersedia", "Legalitas dan masa simpan belum lengkap"],
    mitigations: ["Pendataan pemasok", "Uji masa simpan", "Pendampingan izin", "Pencatatan biaya produksi"],
    prerequisites: ["Berat dan isi produk", "Kapasitas produksi", "HPP", "Bukti izin"],
    facts: [
      { label: "Harga", value: "Rp11.000", status: "Faktual" },
      { label: "Bahan", value: "Daun kelor dan kayu secang", status: "Faktual" },
      { label: "Pasokan bahan", value: "Pemasok belum terdata", status: "Perlu verifikasi" },
      { label: "Kapasitas dan penjualan", value: "Belum tersedia", status: "Perlu verifikasi" },
    ],
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
    investmentStatus: "Rekomendasi",
    investmentUse: ["Pemotong", "Peniris minyak", "Sealer", "Kemasan"],
    market: "Permintaan telah terbentuk melalui toko dan pembeli eceran.",
    risks: ["Kapasitas manual", "Mutu hasil penggorengan", "Dokumen legalitas belum diperiksa"],
    mitigations: ["Peralatan terukur", "SOP produksi", "Verifikasi dokumen", "Kemasan lebih konsisten"],
    prerequisites: ["HPP", "Catatan penjualan", "Bukti NIB/PIRT/halal", "Penawaran alat"],
    facts: [
      { label: "Mulai usaha", value: "Sekitar 2014", status: "Faktual" },
      { label: "Hasil per proses", value: "120–125 kemasan", status: "Faktual" },
      { label: "Frekuensi", value: "Sekitar dua kali seminggu", status: "Faktual" },
      { label: "Harga", value: "Rp4.000 toko; Rp4.500–5.000 eceran", status: "Faktual" },
      { label: "Tenaga kerja", value: "Pemilik dan satu orang", status: "Faktual" },
      { label: "Produksi bulanan", value: "Sekitar 960–1.000 kemasan", status: "Turunan" },
    ],
  },
  {
    id: "UMKM-006",
    slug: "tas-anyaman-plastik",
    name: "Tas Anyaman Plastik",
    owner: "Binti Ziananingrum — menurut katalog",
    category: "Kerajinan",
    product: "Tas anyaman",
    summary: "Kerajinan aktif yang dapat dikembangkan sebagai suvenir dan bagian dari paket wisata desa.",
    image: tasAnyamanAsset.url,
    imageAlt: "Tas anyaman plastik buatan pengrajin Desa Klepu",
    activeStatus: "Aktif",
    readiness: "Perlu penguatan",
    investment: "Rp5–10 juta",
    investmentStatus: "Rekomendasi",
    investmentUse: ["Bahan", "Peralatan", "Pengembangan desain", "Kemasan"],
    market: "Wisatawan, paket suvenir, dan pemasaran oleh Pokdarwis.",
    risks: ["Kapasitas belum diketahui", "Rincian bahan dan biaya belum tersedia", "Pasar belum terdokumentasi"],
    mitigations: ["Pendataan waktu kerja", "Katalog ukuran dan warna", "Kurasi suvenir", "Uji pasar wisata"],
    prerequisites: ["Profil pengrajin", "Kapasitas", "Biaya produksi", "Data pasar"],
    facts: [
      { label: "Harga", value: "Rp45.000", status: "Faktual" },
      { label: "Pembuat", value: "Pengrajin lokal", status: "Faktual" },
      { label: "Pemilik", value: "Belum dikonfirmasi", status: "Perlu verifikasi" },
      { label: "Kapasitas", value: "Belum tersedia", status: "Perlu verifikasi" },
    ],
  },
  {
    id: "UMKM-007",
    slug: "kedai-lungguh",
    name: "Kedai Lungguh",
    owner: "Belum dikonfirmasi",
    category: "Kuliner",
    product: "Kuliner lokal",
    summary: "Kedai aktif yang berpotensi terhubung dengan wisata dan paket oleh-oleh Desa Klepu.",
    image: heroImage,
    imageAlt: "Ragam hasil usaha lokal Desa Klepu",
    activeStatus: "Aktif",
    readiness: "Data awal",
    investment: "Belum ditetapkan",
    investmentStatus: "Perlu verifikasi",
    investmentUse: ["Kebutuhan alat belum didata", "Kapasitas belum didata", "Rencana investasi belum divalidasi"],
    market: "Pelanggan kuliner lokal dan potensi pasar wisata.",
    risks: ["Profil usaha belum lengkap", "Data produk dan penjualan belum tersedia"],
    mitigations: ["Wawancara pemilik", "Inventarisasi produk", "Pencatatan produksi dan pasar"],
    prerequisites: ["Konfirmasi pemilik", "Daftar produk", "Kapasitas", "Kebutuhan dana"],
    facts: [
      { label: "Bidang", value: "Kuliner", status: "Faktual" },
      { label: "Status usaha", value: "Aktif", status: "Faktual" },
      { label: "Pemilik", value: "Belum dikonfirmasi", status: "Perlu verifikasi" },
      { label: "Rencana investasi", value: "Belum disusun", status: "Perlu verifikasi" },
    ],
  },
];

export const widerOpportunities = [
  { name: "Beras kemasan", investment: "Rp10–20 juta", status: "Menunggu volume" },
  { name: "Susu pasteurisasi & yoghurt", investment: "Rp35–85 juta", status: "Belum dinilai" },
  { name: "Paket oleh-oleh", investment: "Rp5–12 juta", status: "Prospektif" },
  { name: "Kompos", investment: "Rp15–35 juta", status: "Menunggu data limbah" },
];

export function getUmkm(slug: string) {
  return umkmList.find((item) => item.slug === slug);
}