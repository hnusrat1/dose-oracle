'use client';

import { useState, useMemo } from 'react';
import { convertDose, convertConstraintToNewFractionation, formatDose } from '@/lib/calculations';
import { CalculatorIcon } from '@heroicons/react/24/outline';

interface DoseConverterProps {
  defaultAlphaBeta?: number;
}

export function DoseConverter({ defaultAlphaBeta = 3 }: DoseConverterProps) {
  const [totalDose, setTotalDose] = useState<string>('');
  const [fractions, setFractions] = useState<string>('');
  const [alphaBeta, setAlphaBeta] = useState<string>(defaultAlphaBeta.toString());
  const [targetFractions, setTargetFractions] = useState<string>('');

  const result = useMemo(() => {
    const dose = parseFloat(totalDose);
    const fx = parseInt(fractions);
    const ab = parseFloat(alphaBeta);

    if (isNaN(dose) || isNaN(fx) || isNaN(ab) || fx <= 0 || ab <= 0) {
      return null;
    }

    const conversion = convertDose(dose, fx, ab);
    const targetFx = parseInt(targetFractions);
    let convertedDose: number | null = null;

    if (!isNaN(targetFx) && targetFx > 0) {
      convertedDose = convertConstraintToNewFractionation(dose, fx, targetFx, ab);
    }

    return {
      ...conversion,
      convertedDose,
      targetFractions: targetFx,
    };
  }, [totalDose, fractions, alphaBeta, targetFractions]);

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <CalculatorIcon className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">BED / EQD2 Calculator</h3>
          <p className="text-xs text-slate-400">Convert doses between fractionation schemes</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Total Dose (Gy)
          </label>
          <input
            type="number"
            value={totalDose}
            onChange={(e) => setTotalDose(e.target.value)}
            placeholder="60"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white font-semibold placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Fractions
          </label>
          <input
            type="number"
            value={fractions}
            onChange={(e) => setFractions(e.target.value)}
            placeholder="30"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white font-semibold placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            α/β (Gy)
          </label>
          <select
            value={alphaBeta}
            onChange={(e) => setAlphaBeta(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white font-semibold focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="10">10 (Tumor/Acute)</option>
            <option value="3">3 (Late tissue)</option>
            <option value="2">2 (CNS)</option>
            <option value="1.5">1.5 (Prostate)</option>
            <option value="0.87">0.87 (Cord)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Convert to (fx)
          </label>
          <input
            type="number"
            value={targetFractions}
            onChange={(e) => setTargetFractions(e.target.value)}
            placeholder="5"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white font-semibold placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {result && (
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Dose/Fx</div>
              <div className="text-2xl font-bold text-white">
                {formatDose(result.dosePerFraction)}
                <span className="text-sm text-slate-400 ml-1">Gy</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">BED</div>
              <div className="text-2xl font-bold text-blue-400">
                {formatDose(result.bed)}
                <span className="text-sm text-blue-300/70 ml-1">Gy</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">EQD2</div>
              <div className="text-2xl font-bold text-purple-400">
                {formatDose(result.eqd2)}
                <span className="text-sm text-purple-300/70 ml-1">Gy</span>
              </div>
            </div>
            {result.convertedDose && (
              <div className="text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  In {result.targetFractions} fx
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {formatDose(result.convertedDose)}
                  <span className="text-sm text-cyan-300/70 ml-1">Gy</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-4 text-center font-mono">
        BED = nd(1 + d/(α/β)) &nbsp;•&nbsp; EQD2 = BED / (1 + 2/(α/β))
      </p>
    </div>
  );
}
