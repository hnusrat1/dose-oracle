'use client';

interface PrescriptionInputProps {
  dose: number;
  fractions: number;
  onDoseChange: (dose: number) => void;
  onFractionsChange: (fractions: number) => void;
}

const commonPrescriptions = [
  { label: '54 Gy / 3 fx', dose: 54, fractions: 3, type: 'SBRT' },
  { label: '50 Gy / 5 fx', dose: 50, fractions: 5, type: 'SBRT' },
  { label: '48 Gy / 4 fx', dose: 48, fractions: 4, type: 'SBRT' },
  { label: '60 Gy / 8 fx', dose: 60, fractions: 8, type: 'Hypo' },
  { label: '60 Gy / 30 fx', dose: 60, fractions: 30, type: 'Conv' },
  { label: '70 Gy / 35 fx', dose: 70, fractions: 35, type: 'Conv' },
];

export function PrescriptionInput({
  dose,
  fractions,
  onDoseChange,
  onFractionsChange,
}: PrescriptionInputProps) {
  const dosePerFraction = fractions > 0 ? dose / fractions : 0;

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white mb-6">
        Your Prescription
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Total Dose
          </label>
          <div className="relative">
            <input
              type="number"
              value={dose || ''}
              onChange={(e) => onDoseChange(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-4 text-2xl font-bold rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="54"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              Gy
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Fractions
          </label>
          <div className="relative">
            <input
              type="number"
              value={fractions || ''}
              onChange={(e) => onFractionsChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-4 text-2xl font-bold rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="3"
              min="1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              fx
            </span>
          </div>
        </div>
      </div>

      {dosePerFraction > 0 && (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 mb-6 border border-cyan-500/20">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400">
              {dosePerFraction.toFixed(2)}
              <span className="text-lg ml-1 text-cyan-300">Gy/fx</span>
            </div>
            <div className="text-sm text-slate-400 mt-1">Dose per fraction</div>
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Quick Select
        </div>
        <div className="flex flex-wrap gap-2">
          {commonPrescriptions.map((rx) => (
            <button
              key={rx.label}
              onClick={() => {
                onDoseChange(rx.dose);
                onFractionsChange(rx.fractions);
              }}
              className={`px-3 py-2 text-sm rounded-lg transition-all border ${
                dose === rx.dose && fractions === rx.fractions
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-700/50 text-slate-300 border-slate-600/50 hover:border-slate-500 hover:bg-slate-700'
              }`}
            >
              <span className="font-medium">{rx.label}</span>
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                rx.type === 'SBRT' ? 'bg-purple-500/20 text-purple-400' :
                rx.type === 'Hypo' ? 'bg-amber-500/20 text-amber-400' :
                'bg-slate-600/50 text-slate-400'
              }`}>
                {rx.type}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
