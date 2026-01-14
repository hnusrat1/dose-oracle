'use client';

import { TREATMENT_SITES, TreatmentSite } from '@/data/treatment-sites';

interface TreatmentSiteSelectorProps {
  selectedSite: TreatmentSite | null;
  onSelectSite: (site: TreatmentSite) => void;
}

const categories = [
  { id: 'thorax', name: 'Thorax', icon: '🫁', color: 'from-blue-500 to-cyan-500' },
  { id: 'cns', name: 'CNS', icon: '🧠', color: 'from-purple-500 to-pink-500' },
  { id: 'spine', name: 'Spine', icon: '🦴', color: 'from-amber-500 to-orange-500' },
  { id: 'abdomen', name: 'Abdomen', icon: '🫀', color: 'from-red-500 to-rose-500' },
  { id: 'pelvis', name: 'Pelvis', icon: '🦴', color: 'from-emerald-500 to-teal-500' },
  { id: 'head-neck', name: 'Head & Neck', icon: '👤', color: 'from-indigo-500 to-violet-500' },
] as const;

export function TreatmentSiteSelector({
  selectedSite,
  onSelectSite,
}: TreatmentSiteSelectorProps) {
  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const sitesInCategory = TREATMENT_SITES.filter(
          (s) => s.category === category.id
        );
        if (sitesInCategory.length === 0) return null;

        return (
          <div key={category.id}>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-3">
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
              <div className={`flex-1 h-px bg-gradient-to-r ${category.color} opacity-30`} />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sitesInCategory.map((site) => (
                <button
                  key={site.id}
                  onClick={() => onSelectSite(site)}
                  className={`group text-left p-5 rounded-xl border transition-all duration-300 ${
                    selectedSite?.id === site.id
                      ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {site.name}
                    </div>
                    <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                      {site.icon}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mt-2 line-clamp-2">
                    {site.description}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-0.5 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600/50">
                      {site.defaultDose} Gy
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600/50">
                      {site.defaultFractions} fx
                    </span>
                    <span className="text-xs text-slate-500">
                      {site.relevantOrgans.length} OARs
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
