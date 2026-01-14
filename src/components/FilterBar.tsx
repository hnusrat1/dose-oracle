'use client';

import { BodyRegion, FractionationRegime } from '@/lib/types';
import { getRegionDisplayName } from '@/lib/search';

interface FilterBarProps {
  region: BodyRegion | 'all';
  fractionation: FractionationRegime | 'all';
  fractions: number | null;
  onRegionChange: (region: BodyRegion | 'all') => void;
  onFractionationChange: (fractionation: FractionationRegime | 'all') => void;
  onFractionsChange: (fractions: number | null) => void;
}

const regions: (BodyRegion | 'all')[] = [
  'all',
  'head-neck',
  'thorax',
  'abdomen',
  'pelvis',
  'spine',
];

const fractionations: { value: FractionationRegime | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'conventional', label: 'Conventional' },
  { value: 'sbrt', label: 'SBRT/SRS' },
];

const sbrtFractions = [1, 3, 5];

export function FilterBar({
  region,
  fractionation,
  fractions,
  onRegionChange,
  onFractionationChange,
  onFractionsChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Region Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600">Region:</label>
        <div className="flex flex-wrap gap-1">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                region === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? 'All' : getRegionDisplayName(r)}
            </button>
          ))}
        </div>
      </div>

      {/* Fractionation Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600">Fractionation:</label>
        <div className="flex gap-1">
          {fractionations.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                onFractionationChange(f.value);
                if (f.value !== 'sbrt') {
                  onFractionsChange(null);
                }
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                fractionation === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SBRT Fractions Filter */}
      {fractionation === 'sbrt' && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Fractions:</label>
          <div className="flex gap-1">
            <button
              onClick={() => onFractionsChange(null)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                fractions === null
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {sbrtFractions.map((f) => (
              <button
                key={f}
                onClick={() => onFractionsChange(f)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  fractions === f
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f} fx
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
