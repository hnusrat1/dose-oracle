export type FractionationRegime = 'conventional' | 'sbrt';

export type EvidenceLevel = 'A' | 'B' | 'C' | 'D';

export interface Source {
  name: string;
  shortName: string;
  year: number;
  pmid?: string;
  doi?: string;
  citation: string;
}

export interface Constraint {
  id: string;
  organ: string;
  organAliases: string[];
  structure: string; // TG-263 standardized name
  region: BodyRegion;
  endpoint: string;
  metric: string;
  metricDetail?: string; // e.g., "0.03cc" for Dmax
  limit: number;
  limitUnit: string;
  limitType: 'max' | 'mean' | 'volume';
  fractionation: FractionationRegime;
  fractions?: number; // specific number if SBRT
  totalDose?: number; // reference total dose if relevant
  alphaBeta: number;
  riskAtLimit?: string; // e.g., "< 5%"
  source: Source;
  notes?: string;
  evidenceLevel: EvidenceLevel;
}

export type BodyRegion =
  | 'head-neck'
  | 'thorax'
  | 'abdomen'
  | 'pelvis'
  | 'spine'
  | 'extremity';

export interface OrganGroup {
  name: string;
  region: BodyRegion;
  organs: string[];
}

// BED calculation: BED = nd(1 + d/(α/β))
// EQD2 calculation: EQD2 = BED / (1 + 2/(α/β))
export interface DoseConversion {
  originalDose: number;
  originalFractions: number;
  alphaBeta: number;
  bed: number;
  eqd2: number;
}
