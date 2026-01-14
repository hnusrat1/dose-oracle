'use client';

import { BodyRegion } from '@/lib/types';
import { getOrgansByRegion, getRegionDisplayName } from '@/lib/search';

interface OrganNavProps {
  selectedOrgan: string | null;
  onSelectOrgan: (organ: string | null) => void;
}

const regionIcons: Record<BodyRegion, string> = {
  'head-neck': '🧠',
  thorax: '🫁',
  abdomen: '🫀',
  pelvis: '🦴',
  spine: '🦴',
  extremity: '🦵',
};

const regions: BodyRegion[] = ['head-neck', 'thorax', 'abdomen', 'pelvis', 'spine'];

export function OrganNav({ selectedOrgan, onSelectOrgan }: OrganNavProps) {
  const organsByRegion = getOrgansByRegion();

  return (
    <div className="space-y-4">
      <button
        onClick={() => onSelectOrgan(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedOrgan === null
            ? 'bg-blue-100 text-blue-800'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        All Organs
      </button>

      {regions.map((region) => (
        <div key={region}>
          <div className="flex items-center gap-2 px-3 py-1">
            <span>{regionIcons[region]}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {getRegionDisplayName(region)}
            </span>
          </div>
          <div className="mt-1 space-y-0.5">
            {organsByRegion[region].map((organ) => (
              <button
                key={organ}
                onClick={() => onSelectOrgan(organ)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedOrgan === organ
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {organ}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
