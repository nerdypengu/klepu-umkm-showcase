export type Category = "Kopi" | "Herbal" | "Makanan" | "Kerajinan" | "Kuliner";

export interface BusinessFact {
  label: string;
  value: string;
}

export interface Opportunity {
  name: string;
  investment: string;
  detail: string;
  recommended?: boolean;
  recommendedReason?: string;
}

export interface InvestmentScore {
  distribution: number;
  technology: number;
  market: number;
  finance: number;
  materials: number;
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
  marketTargets?: string[];
  marketNote?: string;
  score: InvestmentScore;
  opportunityContext: string;
  opportunities: Opportunity[];
  risks: string[];
  mitigations: string[];
  prerequisites: string[];
  facts: BusinessFact[];
  operations?: BusinessFact[];
  roles?: BusinessFact[];
  gaps?: string[];
  priorityRank?: number;
  priorityTotal?: number;
  prioritySummary?: string;
  potentials?: string[];
  roiSimulation?: { roi: string; payback: string; basis: string };
  videos?: { src: string; poster: string }[];
  description?: string;
  price?: string;
  whatsapp?: string;
  mapsUrl?: string;
}

const LAPAK_WHATSAPP = "https://api.whatsapp.com/send?phone=+6281216022043";
const LAPAK_MAPS = "https://www.google.com/maps?q=-7.922506701004813,111.65794009342791";

const coffeeShared = {
  readiness: "Siap berkembang",
  investment: "Rp20–28 juta",
  investmentUse: ["Mesin sangrai", "Grinder", "Sealer dan kemasan", "Modal kerja awal"],
  market: "Wisatawan, toko, kios Goa Maria, pusat oleh-oleh, reseller, dan kanal daring.",
  marketTargets: [
    "Wisatawan Goa Maria dan rombongan ziarah",
    "Toko dan pusat oleh-oleh Ponorogo",
    "Reseller kopi antarkota",
    "Kafe dan kedai kopi lokal",
    "Pembeli daring lewat WhatsApp dan marketplace",
  ],
  marketNote: "Prioritaskan wisatawan dan pusat oleh-oleh karena volume kunjungan Goa Maria paling stabil sepanjang tahun.",
  score: { distribution: 80, technology: 70, market: 88, finance: 72, materials: 90 },
  opportunityContext: "Pengembangan produk turunan dari Kopi Liberika Klepu yang bisa dijalankan dari usaha ini.",
  risks: ["Kontinuitas pasokan kopi", "Konsistensi mutu sangrai", "Perubahan harga dan penjualan"],
  mitigations: ["Pemasok tetap", "SOP produksi", "Komitmen pembelian", "Diversifikasi produk"],
  prerequisites: ["Perhitungan HPP per kemasan", "Target dan rencana penjualan", "Dokumen izin usaha", "Penawaran harga alat dari supplier"],
  operations: [
    { label: "Bahan baku", value: "Kopi Liberika dari petani Desa Klepu melalui jaringan pemasok desa" },
    { label: "Kebutuhan alat", value: "Mesin sangrai (roaster), grinder, sealer, dan kemasan" },
    { label: "Model investasi", value: "Alat bersama antar-UMKM kopi atau pembiayaan bertahap" },
    { label: "Kanal penjualan", value: "Toko, kios Goa Maria, pusat oleh-oleh, dan pemesanan langsung" },
    { label: "Legalitas", value: "Perizinan usaha tersedia dan dapat dilengkapi" },
  ],
  roles: [
    { label: "Pelaksana utama", value: "UMKM kopi bersama petani kopi Klepu" },
    { label: "Pokdarwis Jayandaru", value: "Promosi lewat jalur wisata desa" },
    { label: "BUMDes / Pemerintah Desa", value: "Pengadaan mesin bersama dan fasilitasi" },
  ],
  gaps: ["Perhitungan HPP per kemasan", "Target penjualan historis", "Finalisasi dokumen izin", "Kerja sama volume pasokan kopi"],
  priorityRank: 1,
  priorityTotal: 8,
  prioritySummary: "Produk dan pasarnya sudah tersedia.",
  potentials: ["POT-001 Kopi Liberika — kebun Klepu / Banyu Putih"],
  roiSimulation: {
    roi: "±35–45% per tahun",
    payback: "±2–2,5 tahun",
    basis: "Simulasi dari harga jual kopi kemasan, kapasitas sangrai mesin, dan permintaan pasar oleh-oleh serta kanal daring.",
  },
};

const coffeeOpportunities: Opportunity[] = [
  { name: "Drip bag kopi", investment: "Rp6–12 juta", detail: "Kemasan sekali seduh untuk wisatawan dan pengiriman antarkota." },
  { name: "Kopi kemasan premium", investment: "Rp8–15 juta", detail: "Ukuran 100 g dan 250 g dengan label, tanggal sangrai, dan profil rasa.", recommended: true, recommendedReason: "Modal paling terukur dengan kenaikan harga jual tercepat karena pasar oleh-oleh sudah tersedia." },
  { name: "Paket oleh-oleh kopi", investment: "Rp5–12 juta", detail: "Kopi digabung camilan desa sebagai satu paket suvenir." },
  { name: "Wisata kopi", investment: "Rp15–30 juta", detail: "Kunjungan kebun, sangrai, dan seduh bersama untuk rombongan wisata." },
];

export function scoreTotal(score: InvestmentScore) {
  const values = [score.distribution, score.technology, score.market, score.finance, score.materials];
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
