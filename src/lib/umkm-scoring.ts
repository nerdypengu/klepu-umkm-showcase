import type { InvestmentScore, Umkm } from "@/lib/umkm-data";
import { scoreTotal } from "@/lib/umkm-data";

export interface UmkmAssessmentCriteria {
  // 1. Bahan Baku (materials)
  rawMaterialSource: "desa_klepu" | "sebagian_luar" | "luar_desa";
  rawMaterialAvailability: "melimpah" | "musiman" | "terbatas";
  supplierNetwork: boolean;

  // 2. Pasar & Permintaan (market)
  salesDemandStatus: "rutin" | "pesanan_saja" | "belum_stabil";
  marketChannels: string[]; // e.g. "wisata", "oleh_oleh", "online", "reseller", "kafe"
  clearTargetMarket: boolean;

  // 3. Distribusi & Kemasan (distribution)
  packagingType: "pouch_segel_label" | "plastik_segel" | "plastik_biasa";
  productShelfLife: "gt_6m" | "3_6m" | "1_3m" | "lt_1m";
  deliveryAccess: "ada_armada_ekspedisi" | "ekspedisi_saja" | "lokal_saja";

  // 4. Keuangan & Legalitas (finance)
  licenses: string[]; // e.g. "NIB", "P-IRT", "Halal", "BPOM"
  bookkeeping: "digital_rapi" | "buku_kas_manual" | "belum_ada";
  costCalculation: "hpp_terhitung" | "perkiraan_kasar" | "belum_tahu";

  // 5. Teknologi & Peralatan (technology)
  machineryStatus: "modern_lengkap" | "semi_manual" | "manual_tradisional";
  upgradeIdentified: boolean;
  workforceReadiness: "terlatih" | "butuh_pelatihan" | "terbatas";
}

export const DEFAULT_ASSESSMENT_CRITERIA: UmkmAssessmentCriteria = {
  rawMaterialSource: "desa_klepu",
  rawMaterialAvailability: "melimpah",
  supplierNetwork: true,

  salesDemandStatus: "rutin",
  marketChannels: ["wisata", "oleh_oleh"],
  clearTargetMarket: true,

  packagingType: "pouch_segel_label",
  productShelfLife: "3_6m",
  deliveryAccess: "ada_armada_ekspedisi",

  licenses: ["NIB"],
  bookkeeping: "buku_kas_manual",
  costCalculation: "hpp_terhitung",

  machineryStatus: "semi_manual",
  upgradeIdentified: true,
  workforceReadiness: "terlatih",
};

export function calculateUmkmScore(criteria: UmkmAssessmentCriteria): InvestmentScore {
  // 1. Materials (0-100)
  let materials = 0;
  if (criteria.rawMaterialSource === "desa_klepu") materials += 40;
  else if (criteria.rawMaterialSource === "sebagian_luar") materials += 25;
  else materials += 10;

  if (criteria.rawMaterialAvailability === "melimpah") materials += 35;
  else if (criteria.rawMaterialAvailability === "musiman") materials += 20;
  else materials += 10;

  if (criteria.supplierNetwork) materials += 25;
  else materials += 5;

  // 2. Market (0-100)
  let market = 0;
  if (criteria.salesDemandStatus === "rutin") market += 35;
  else if (criteria.salesDemandStatus === "pesanan_saja") market += 20;
  else market += 10;

  // Channels (up to 35 points, ~7-8 points each)
  const channelCount = criteria.marketChannels?.length || 0;
  market += Math.min(35, channelCount * 8 + (channelCount > 0 ? 5 : 0));

  if (criteria.clearTargetMarket) market += 30;
  else market += 5;

  // 3. Distribution (0-100)
  let distribution = 0;
  if (criteria.packagingType === "pouch_segel_label") distribution += 35;
  else if (criteria.packagingType === "plastik_segel") distribution += 25;
  else distribution += 10;

  if (criteria.productShelfLife === "gt_6m") distribution += 35;
  else if (criteria.productShelfLife === "3_6m") distribution += 28;
  else if (criteria.productShelfLife === "1_3m") distribution += 18;
  else distribution += 10;

  if (criteria.deliveryAccess === "ada_armada_ekspedisi") distribution += 30;
  else if (criteria.deliveryAccess === "ekspedisi_saja") distribution += 20;
  else distribution += 10;

  // 4. Finance (0-100)
  let finance = 0;
  const licenseCount = criteria.licenses?.length || 0;
  // 10 pts per license up to 35 pts
  finance += Math.min(35, licenseCount * 10 + (licenseCount > 0 ? 5 : 0));

  if (criteria.bookkeeping === "digital_rapi") finance += 35;
  else if (criteria.bookkeeping === "buku_kas_manual") finance += 20;
  else finance += 5;

  if (criteria.costCalculation === "hpp_terhitung") finance += 30;
  else if (criteria.costCalculation === "perkiraan_kasar") finance += 15;
  else finance += 5;

  // 5. Technology (0-100)
  let technology = 0;
  if (criteria.machineryStatus === "modern_lengkap") technology += 40;
  else if (criteria.machineryStatus === "semi_manual") technology += 28;
  else technology += 12;

  if (criteria.upgradeIdentified) technology += 30;
  else technology += 10;

  if (criteria.workforceReadiness === "terlatih") technology += 30;
  else if (criteria.workforceReadiness === "butuh_pelatihan") technology += 18;
  else technology += 8;

  const clamp = (val: number) => Math.min(100, Math.max(10, Math.round(val)));

  return {
    materials: clamp(materials),
    market: clamp(market),
    distribution: clamp(distribution),
    finance: clamp(finance),
    technology: clamp(technology),
  };
}

export function getScoreVerdict(total: number): string {
  if (total >= 80) return "Sangat siap untuk investasi & ekspansi";
  if (total >= 70) return "Siap untuk kemitraan & penguatan modal";
  if (total >= 60) return "Cukup siap, potensi tumbuh cepat";
  return "Berkembang, memerlukan pendampingan SOP & legalitas";
}

export function generatePrioritySummary(score: InvestmentScore): string {
  const total = scoreTotal(score);
  if (total >= 80) {
    return "Produk dan pasarnya sudah tersedia, siap akselerasi produksi dan perluasan jejaring distribusi.";
  }
  if (total >= 70) {
    return "Produksi dan permintaan sudah terbentuk stabil, didukung bahan baku lokal dan potensi pasar terukur.";
  }
  if (total >= 60) {
    return "Produksi berjalan aktif, perlu penguatan mesin operasional dan pendampingan izin resmi.";
  }
  return "Keterampilan pengrajin/pelaku usaha siap ditingkatkan kapasitasnya melalui pendampingan desa.";
}

export function inferCriteriaFromUmkm(umkm?: Partial<Umkm> | null): UmkmAssessmentCriteria {
  if (!umkm) return { ...DEFAULT_ASSESSMENT_CRITERIA };

  const criteria: UmkmAssessmentCriteria = { ...DEFAULT_ASSESSMENT_CRITERIA };

  // Infer from category or raw score if available
  if (umkm.score) {
    // If materials score is high, assume local
    if (umkm.score.materials >= 80) {
      criteria.rawMaterialSource = "desa_klepu";
      criteria.rawMaterialAvailability = "melimpah";
      criteria.supplierNetwork = true;
    } else if (umkm.score.materials >= 65) {
      criteria.rawMaterialSource = "sebagian_luar";
      criteria.rawMaterialAvailability = "musiman";
    } else {
      criteria.rawMaterialSource = "luar_desa";
      criteria.rawMaterialAvailability = "terbatas";
      criteria.supplierNetwork = false;
    }

    // Market
    if (umkm.score.market >= 80) {
      criteria.salesDemandStatus = "rutin";
      criteria.clearTargetMarket = true;
      criteria.marketChannels = ["wisata", "oleh_oleh", "reseller", "online"];
    } else if (umkm.score.market >= 65) {
      criteria.salesDemandStatus = "pesanan_saja";
      criteria.marketChannels = ["wisata", "oleh_oleh"];
    } else {
      criteria.salesDemandStatus = "belum_stabil";
      criteria.marketChannels = ["wisata"];
    }

    // Distribution
    if (umkm.score.distribution >= 80) {
      criteria.packagingType = "pouch_segel_label";
      criteria.productShelfLife = "gt_6m";
      criteria.deliveryAccess = "ada_armada_ekspedisi";
    } else if (umkm.score.distribution >= 65) {
      criteria.packagingType = "plastik_segel";
      criteria.productShelfLife = "3_6m";
      criteria.deliveryAccess = "ekspedisi_saja";
    } else {
      criteria.packagingType = "plastik_biasa";
      criteria.productShelfLife = "1_3m";
      criteria.deliveryAccess = "lokal_saja";
    }

    // Finance
    if (umkm.score.finance >= 70) {
      criteria.licenses = ["NIB", "P-IRT"];
      criteria.bookkeeping = "digital_rapi";
      criteria.costCalculation = "hpp_terhitung";
    } else if (umkm.score.finance >= 55) {
      criteria.licenses = ["NIB"];
      criteria.bookkeeping = "buku_kas_manual";
      criteria.costCalculation = "perkiraan_kasar";
    } else {
      criteria.licenses = [];
      criteria.bookkeeping = "belum_ada";
      criteria.costCalculation = "belum_tahu";
    }

    // Technology
    if (umkm.score.technology >= 75) {
      criteria.machineryStatus = "modern_lengkap";
      criteria.upgradeIdentified = true;
      criteria.workforceReadiness = "terlatih";
    } else if (umkm.score.technology >= 60) {
      criteria.machineryStatus = "semi_manual";
      criteria.upgradeIdentified = true;
      criteria.workforceReadiness = "terlatih";
    } else {
      criteria.machineryStatus = "manual_tradisional";
      criteria.upgradeIdentified = false;
      criteria.workforceReadiness = "butuh_pelatihan";
    }
  }

  return criteria;
}
