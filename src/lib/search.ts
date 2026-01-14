import { Constraint, BodyRegion, FractionationRegime } from './types';
import { CONSTRAINTS } from '@/data/constraints';

export interface SearchFilters {
  query: string;
  region?: BodyRegion | 'all';
  fractionation?: FractionationRegime | 'all';
  fractions?: number;
}

/**
 * Normalize a string for fuzzy matching
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Check if a constraint matches a search query
 */
function matchesQuery(constraint: Constraint, query: string): boolean {
  if (!query) return true;

  const normalizedQuery = normalize(query);

  // Check organ name
  if (normalize(constraint.organ).includes(normalizedQuery)) {
    return true;
  }

  // Check organ aliases
  for (const alias of constraint.organAliases) {
    if (normalize(alias).includes(normalizedQuery)) {
      return true;
    }
  }

  // Check structure name
  if (normalize(constraint.structure).includes(normalizedQuery)) {
    return true;
  }

  // Check endpoint
  if (normalize(constraint.endpoint).includes(normalizedQuery)) {
    return true;
  }

  return false;
}

/**
 * Search and filter constraints
 */
export function searchConstraints(filters: SearchFilters): Constraint[] {
  return CONSTRAINTS.filter((constraint) => {
    // Text search
    if (!matchesQuery(constraint, filters.query)) {
      return false;
    }

    // Region filter
    if (filters.region && filters.region !== 'all') {
      if (constraint.region !== filters.region) {
        return false;
      }
    }

    // Fractionation filter
    if (filters.fractionation && filters.fractionation !== 'all') {
      if (constraint.fractionation !== filters.fractionation) {
        return false;
      }
    }

    // Specific fractions filter (for SBRT)
    if (filters.fractions && constraint.fractionation === 'sbrt') {
      if (constraint.fractions && constraint.fractions !== filters.fractions) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get unique organs from constraints
 */
export function getUniqueOrgans(): string[] {
  const organs = new Set(CONSTRAINTS.map((c) => c.organ));
  return Array.from(organs).sort();
}

/**
 * Get constraints grouped by organ
 */
export function getConstraintsByOrgan(): Record<string, Constraint[]> {
  const grouped: Record<string, Constraint[]> = {};

  for (const constraint of CONSTRAINTS) {
    if (!grouped[constraint.organ]) {
      grouped[constraint.organ] = [];
    }
    grouped[constraint.organ].push(constraint);
  }

  return grouped;
}

/**
 * Get constraints grouped by region
 */
export function getConstraintsByRegion(): Record<BodyRegion, Constraint[]> {
  const grouped: Record<BodyRegion, Constraint[]> = {
    'head-neck': [],
    thorax: [],
    abdomen: [],
    pelvis: [],
    spine: [],
    extremity: [],
  };

  for (const constraint of CONSTRAINTS) {
    grouped[constraint.region].push(constraint);
  }

  return grouped;
}

/**
 * Get organs grouped by region for navigation
 */
export function getOrgansByRegion(): Record<BodyRegion, string[]> {
  const result: Record<BodyRegion, Set<string>> = {
    'head-neck': new Set(),
    thorax: new Set(),
    abdomen: new Set(),
    pelvis: new Set(),
    spine: new Set(),
    extremity: new Set(),
  };

  for (const constraint of CONSTRAINTS) {
    result[constraint.region].add(constraint.organ);
  }

  return {
    'head-neck': Array.from(result['head-neck']).sort(),
    thorax: Array.from(result['thorax']).sort(),
    abdomen: Array.from(result['abdomen']).sort(),
    pelvis: Array.from(result['pelvis']).sort(),
    spine: Array.from(result['spine']).sort(),
    extremity: Array.from(result['extremity']).sort(),
  };
}

/**
 * Get human-readable region name
 */
export function getRegionDisplayName(region: BodyRegion): string {
  const names: Record<BodyRegion, string> = {
    'head-neck': 'Head & Neck',
    thorax: 'Thorax',
    abdomen: 'Abdomen',
    pelvis: 'Pelvis',
    spine: 'Spine',
    extremity: 'Extremity',
  };
  return names[region];
}

/**
 * Get evidence level description
 */
export function getEvidenceLevelDescription(level: string): string {
  const descriptions: Record<string, string> = {
    A: 'Strong evidence from prospective trials',
    B: 'Moderate evidence from large retrospective studies',
    C: 'Limited evidence, expert consensus',
    D: 'Very limited data, use with caution',
  };
  return descriptions[level] || 'Unknown';
}
