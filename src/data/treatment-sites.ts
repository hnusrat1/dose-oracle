import { Constraint } from '@/lib/types';
import { CONSTRAINTS } from './constraints';

export interface TreatmentSite {
  id: string;
  name: string;
  description: string;
  category: 'thorax' | 'cns' | 'abdomen' | 'pelvis' | 'head-neck' | 'spine';
  defaultDose: number;
  defaultFractions: number;
  relevantOrgans: string[]; // Organs that matter for this site
  icon: string;
}

export const TREATMENT_SITES: TreatmentSite[] = [
  // Thorax
  {
    id: 'lung-sbrt-peripheral',
    name: 'Lung SBRT (Peripheral)',
    description: 'Peripheral lung tumors >2cm from proximal bronchial tree',
    category: 'thorax',
    defaultDose: 54,
    defaultFractions: 3,
    relevantOrgans: [
      'Spinal Cord',
      'Lung',
      'Heart',
      'Heart/Pericardium',
      'Esophagus',
      'Chest Wall/Ribs',
      'Brachial Plexus',
      'Great Vessels',
      'Skin',
    ],
    icon: '🫁',
  },
  {
    id: 'lung-sbrt-central',
    name: 'Lung SBRT (Central)',
    description: 'Central lung tumors within 2cm of proximal bronchial tree',
    category: 'thorax',
    defaultDose: 50,
    defaultFractions: 5,
    relevantOrgans: [
      'Spinal Cord',
      'Lung',
      'Heart',
      'Heart/Pericardium',
      'Esophagus',
      'Trachea/Bronchus',
      'Proximal Bronchial Tree',
      'Great Vessels',
      'Brachial Plexus',
      'Skin',
    ],
    icon: '🫁',
  },
  {
    id: 'lung-sbrt-single',
    name: 'Lung SBRT (Single Fx)',
    description: 'Single fraction SBRT for small peripheral lung tumors',
    category: 'thorax',
    defaultDose: 34,
    defaultFractions: 1,
    relevantOrgans: [
      'Spinal Cord',
      'Lung',
      'Heart',
      'Esophagus',
      'Chest Wall/Ribs',
      'Brachial Plexus',
      'Great Vessels',
      'Skin',
    ],
    icon: '🫁',
  },
  {
    id: 'lung-conventional',
    name: 'Lung (Conventional)',
    description: 'Definitive or adjuvant lung RT with conventional fractionation',
    category: 'thorax',
    defaultDose: 60,
    defaultFractions: 30,
    relevantOrgans: [
      'Spinal Cord',
      'Lung',
      'Heart',
      'Esophagus',
      'Brachial Plexus',
    ],
    icon: '🫁',
  },

  // CNS
  {
    id: 'brain-met-srs',
    name: 'Brain Metastasis (SRS)',
    description: 'Single fraction stereotactic radiosurgery for brain mets',
    category: 'cns',
    defaultDose: 20,
    defaultFractions: 1,
    relevantOrgans: [
      'Brain',
      'Brainstem',
      'Optic Nerve/Chiasm',
      'Cochlea',
      'Hippocampus',
      'Lens',
    ],
    icon: '🧠',
  },
  {
    id: 'brain-met-fsrt',
    name: 'Brain Metastasis (fSRT)',
    description: 'Fractionated stereotactic RT for brain mets',
    category: 'cns',
    defaultDose: 27,
    defaultFractions: 3,
    relevantOrgans: [
      'Brain',
      'Brainstem',
      'Optic Nerve/Chiasm',
      'Cochlea',
      'Hippocampus',
      'Lens',
    ],
    icon: '🧠',
  },
  {
    id: 'brain-conventional',
    name: 'Brain (Conventional)',
    description: 'Conventional fractionation for primary brain tumors',
    category: 'cns',
    defaultDose: 60,
    defaultFractions: 30,
    relevantOrgans: [
      'Brain',
      'Brainstem',
      'Optic Nerve/Chiasm',
      'Cochlea',
      'Hippocampus',
      'Lens',
      'Retina',
      'Lacrimal Gland',
    ],
    icon: '🧠',
  },
  {
    id: 'pediatric-cns',
    name: 'Pediatric Brain',
    description: 'CNS tumors in pediatric patients',
    category: 'cns',
    defaultDose: 54,
    defaultFractions: 30,
    relevantOrgans: [
      'Brain',
      'Brainstem',
      'Optic Nerve/Chiasm',
      'Cochlea',
      'Hippocampus',
      'Lens',
    ],
    icon: '🧒',
  },

  // Spine
  {
    id: 'spine-sbrt',
    name: 'Spine SBRT',
    description: 'Stereotactic body RT for spine metastases',
    category: 'spine',
    defaultDose: 24,
    defaultFractions: 3,
    relevantOrgans: [
      'Spinal Cord',
      'Cauda Equina',
      'Esophagus',
      'Trachea/Bronchus',
      'Kidneys',
      'Small Bowel',
      'Vertebral Body',
    ],
    icon: '🦴',
  },
  {
    id: 'spine-sbrt-single',
    name: 'Spine SBRT (Single Fx)',
    description: 'Single fraction spine radiosurgery',
    category: 'spine',
    defaultDose: 16,
    defaultFractions: 1,
    relevantOrgans: [
      'Spinal Cord',
      'Cauda Equina',
      'Esophagus',
      'Kidneys',
      'Small Bowel',
      'Vertebral Body',
    ],
    icon: '🦴',
  },
  {
    id: 'spine-conventional',
    name: 'Spine (Palliative)',
    description: 'Conventional palliative RT for spine mets',
    category: 'spine',
    defaultDose: 30,
    defaultFractions: 10,
    relevantOrgans: [
      'Spinal Cord',
      'Cauda Equina',
      'Esophagus',
      'Kidneys',
      'Small Bowel',
    ],
    icon: '🦴',
  },

  // Abdomen
  {
    id: 'liver-sbrt',
    name: 'Liver SBRT',
    description: 'SBRT for liver tumors (HCC or metastases)',
    category: 'abdomen',
    defaultDose: 50,
    defaultFractions: 5,
    relevantOrgans: [
      'Liver',
      'Kidneys',
      'Stomach',
      'Duodenum',
      'Small Bowel',
      'Spinal Cord',
      'Heart',
      'Colon',
    ],
    icon: '🫀',
  },
  {
    id: 'pancreas-sbrt',
    name: 'Pancreas SBRT',
    description: 'SBRT for pancreatic tumors',
    category: 'abdomen',
    defaultDose: 33,
    defaultFractions: 5,
    relevantOrgans: [
      'Stomach',
      'Duodenum',
      'Small Bowel',
      'Kidneys',
      'Liver',
      'Spinal Cord',
      'Colon',
    ],
    icon: '🫀',
  },
  {
    id: 'kidney-sbrt',
    name: 'Kidney SBRT',
    description: 'SBRT for renal cell carcinoma',
    category: 'abdomen',
    defaultDose: 40,
    defaultFractions: 5,
    relevantOrgans: [
      'Kidneys',
      'Liver',
      'Stomach',
      'Small Bowel',
      'Duodenum',
      'Spinal Cord',
      'Colon',
    ],
    icon: '🫀',
  },
  {
    id: 'adrenal-sbrt',
    name: 'Adrenal SBRT',
    description: 'SBRT for adrenal metastases',
    category: 'abdomen',
    defaultDose: 36,
    defaultFractions: 3,
    relevantOrgans: [
      'Kidneys',
      'Liver',
      'Stomach',
      'Small Bowel',
      'Duodenum',
      'Spinal Cord',
      'Adrenal Gland',
    ],
    icon: '🫀',
  },

  // Pelvis
  {
    id: 'prostate-conventional',
    name: 'Prostate (Conventional)',
    description: 'Definitive prostate RT with conventional fractionation',
    category: 'pelvis',
    defaultDose: 78,
    defaultFractions: 39,
    relevantOrgans: [
      'Rectum',
      'Bladder',
      'Femoral Heads',
      'Penile Bulb',
      'Small Bowel',
      'Sigmoid',
    ],
    icon: '🦴',
  },
  {
    id: 'prostate-moderate-hypo',
    name: 'Prostate (Moderate Hypo)',
    description: 'Moderately hypofractionated prostate RT',
    category: 'pelvis',
    defaultDose: 60,
    defaultFractions: 20,
    relevantOrgans: [
      'Rectum',
      'Bladder',
      'Femoral Heads',
      'Penile Bulb',
      'Small Bowel',
    ],
    icon: '🦴',
  },
  {
    id: 'prostate-sbrt',
    name: 'Prostate SBRT',
    description: 'Ultra-hypofractionated prostate SBRT',
    category: 'pelvis',
    defaultDose: 36.25,
    defaultFractions: 5,
    relevantOrgans: [
      'Rectum',
      'Bladder',
      'Femoral Heads',
      'Penile Bulb',
      'Urethra',
    ],
    icon: '🦴',
  },
  {
    id: 'cervix-conventional',
    name: 'Cervix/Uterus',
    description: 'Definitive or adjuvant pelvic RT',
    category: 'pelvis',
    defaultDose: 45,
    defaultFractions: 25,
    relevantOrgans: [
      'Rectum',
      'Bladder',
      'Femoral Heads',
      'Small Bowel',
      'Sigmoid',
      'Kidneys',
      'Ovaries',
      'Vagina',
    ],
    icon: '🦴',
  },
  {
    id: 'rectum-conventional',
    name: 'Rectum',
    description: 'Neoadjuvant or definitive rectal RT',
    category: 'pelvis',
    defaultDose: 50.4,
    defaultFractions: 28,
    relevantOrgans: [
      'Small Bowel',
      'Bladder',
      'Femoral Heads',
      'Sigmoid',
      'Sacral Plexus',
    ],
    icon: '🦴',
  },

  // Head & Neck
  {
    id: 'head-neck-conventional',
    name: 'Head & Neck',
    description: 'Definitive or adjuvant H&N RT',
    category: 'head-neck',
    defaultDose: 70,
    defaultFractions: 35,
    relevantOrgans: [
      'Spinal Cord',
      'Brainstem',
      'Parotid Gland',
      'Submandibular Gland',
      'Larynx',
      'Cochlea',
      'Optic Nerve/Chiasm',
      'Brain',
      'Esophagus',
      'Mandible',
      'TMJ',
      'Oral Cavity',
      'Pharyngeal Constrictors',
      'Thyroid',
    ],
    icon: '👤',
  },
  {
    id: 'nasopharynx',
    name: 'Nasopharynx',
    description: 'Definitive nasopharyngeal carcinoma RT',
    category: 'head-neck',
    defaultDose: 70,
    defaultFractions: 35,
    relevantOrgans: [
      'Spinal Cord',
      'Brainstem',
      'Parotid Gland',
      'Cochlea',
      'Optic Nerve/Chiasm',
      'Lens',
      'Retina',
      'Brain',
      'Hippocampus',
      'TMJ',
    ],
    icon: '👤',
  },
];

/**
 * Get constraints relevant to a treatment site
 */
export function getConstraintsForSite(siteId: string): Constraint[] {
  const site = TREATMENT_SITES.find((s) => s.id === siteId);
  if (!site) return [];

  return CONSTRAINTS.filter((c) => site.relevantOrgans.includes(c.organ));
}

/**
 * Get constraints for a site, filtered by fractionation compatibility
 */
export function getConstraintsForSiteAndFractionation(
  siteId: string,
  fractions: number
): Constraint[] {
  const site = TREATMENT_SITES.find((s) => s.id === siteId);
  if (!site) return [];

  const isConventional = fractions >= 10;
  const isSBRT = fractions <= 5;

  return CONSTRAINTS.filter((c) => {
    // Must be a relevant organ
    if (!site.relevantOrgans.includes(c.organ)) return false;

    // Match fractionation regime
    if (isConventional && c.fractionation === 'conventional') return true;
    if (isSBRT && c.fractionation === 'sbrt') {
      // If specific fractions, prefer matching
      if (c.fractions && c.fractions === fractions) return true;
      // If no specific fractions or close enough, include
      if (!c.fractions) return true;
      // Include nearby fraction counts for reference
      if (Math.abs(c.fractions - fractions) <= 2) return true;
    }
    // For moderate hypo (6-9 fx), show both
    if (fractions >= 6 && fractions <= 9) return true;

    return false;
  });
}

/**
 * Group constraints by organ
 */
export function groupConstraintsByOrgan(
  constraints: Constraint[]
): Record<string, Constraint[]> {
  const grouped: Record<string, Constraint[]> = {};

  for (const c of constraints) {
    if (!grouped[c.organ]) {
      grouped[c.organ] = [];
    }
    grouped[c.organ].push(c);
  }

  return grouped;
}
