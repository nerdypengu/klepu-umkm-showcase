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


export function scoreTotal(score: InvestmentScore) {
  const values = [score.distribution, score.technology, score.market, score.finance, score.materials];
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
