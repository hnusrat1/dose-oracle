/**
 * Radiobiology calculations for dose conversions
 *
 * BED = n * d * (1 + d/(α/β))
 * Where:
 *   n = number of fractions
 *   d = dose per fraction
 *   α/β = alpha/beta ratio (Gy)
 *
 * EQD2 = BED / (1 + 2/(α/β))
 * This gives the equivalent dose if delivered in 2 Gy fractions
 */

export interface DoseConversionResult {
  totalDose: number;
  fractions: number;
  dosePerFraction: number;
  alphaBeta: number;
  bed: number;
  eqd2: number;
}

/**
 * Calculate BED (Biologically Effective Dose)
 */
export function calculateBED(
  totalDose: number,
  fractions: number,
  alphaBeta: number
): number {
  const dosePerFraction = totalDose / fractions;
  return totalDose * (1 + dosePerFraction / alphaBeta);
}

/**
 * Calculate EQD2 (Equivalent Dose in 2 Gy fractions)
 */
export function calculateEQD2(bed: number, alphaBeta: number): number {
  return bed / (1 + 2 / alphaBeta);
}

/**
 * Full dose conversion from one fractionation to 2 Gy equivalent
 */
export function convertDose(
  totalDose: number,
  fractions: number,
  alphaBeta: number
): DoseConversionResult {
  const dosePerFraction = totalDose / fractions;
  const bed = calculateBED(totalDose, fractions, alphaBeta);
  const eqd2 = calculateEQD2(bed, alphaBeta);

  return {
    totalDose,
    fractions,
    dosePerFraction,
    alphaBeta,
    bed,
    eqd2,
  };
}

/**
 * Convert a constraint limit from its original fractionation to a target fractionation
 * This is useful for translating constraints between SBRT and conventional
 */
export function convertConstraintToNewFractionation(
  originalLimit: number,
  originalFractions: number,
  targetFractions: number,
  alphaBeta: number
): number {
  // First, calculate the BED of the original constraint
  const originalBed = calculateBED(originalLimit, originalFractions, alphaBeta);

  // Now solve for the total dose that would give the same BED in the new fractionation
  // BED = n * d * (1 + d/(α/β))
  // BED = D * (1 + D/(n*α/β))  where D = total dose = n*d
  // This is a quadratic in D: D^2/(n*α/β) + D - BED = 0

  const a = 1 / (targetFractions * alphaBeta);
  const b = 1;
  const c = -originalBed;

  // Quadratic formula: D = (-b + sqrt(b^2 - 4ac)) / (2a)
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    // Should never happen for valid inputs
    return originalLimit;
  }

  const newTotalDose = (-b + Math.sqrt(discriminant)) / (2 * a);
  return newTotalDose;
}

/**
 * Format dose value for display
 */
export function formatDose(dose: number, decimals: number = 1): string {
  return dose.toFixed(decimals);
}

/**
 * Common α/β ratios
 */
export const ALPHA_BETA_RATIOS = {
  acuteTissue: 10,
  lateTissue: 3,
  prostate: 1.5,
  spinalCord: 2, // Can be as low as 0.87
  brain: 2,
  lung: 3,
  kidney: 2,
  liver: 2,
  rectum: 3,
  bladder: 5,
  bone: 0.85,
} as const;

/**
 * Get a descriptive tissue type for an α/β ratio
 */
export function getAlphaBetaDescription(alphaBeta: number): string {
  if (alphaBeta <= 1) {
    return 'Very late-responding tissue (bone, cord)';
  } else if (alphaBeta <= 2) {
    return 'Late-responding tissue';
  } else if (alphaBeta <= 4) {
    return 'Late-responding tissue (typical)';
  } else if (alphaBeta <= 6) {
    return 'Intermediate';
  } else {
    return 'Acute-responding tissue / tumor';
  }
}
