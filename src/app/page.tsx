'use client';

import { useState, useMemo } from 'react';
import { TreatmentSiteSelector } from '@/components/TreatmentSiteSelector';
import { PrescriptionInput } from '@/components/PrescriptionInput';
import { ConstraintResults } from '@/components/ConstraintResults';
import { DoseConverter } from '@/components/DoseConverter';
import {
  TREATMENT_SITES,
  TreatmentSite,
  getConstraintsForSiteAndFractionation,
} from '@/data/treatment-sites';
import { CONSTRAINTS } from '@/data/constraints';
import {
  BeakerIcon,
  CalculatorIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

type Step = 'select-site' | 'enter-rx' | 'view-results';

export default function Home() {
  const [step, setStep] = useState<Step>('select-site');
  const [selectedSite, setSelectedSite] = useState<TreatmentSite | null>(null);
  const [dose, setDose] = useState<number>(0);
  const [fractions, setFractions] = useState<number>(0);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleSelectSite = (site: TreatmentSite) => {
    setSelectedSite(site);
    setDose(site.defaultDose);
    setFractions(site.defaultFractions);
    setStep('enter-rx');
  };

  const handleBack = () => {
    if (step === 'view-results') {
      setStep('enter-rx');
    } else if (step === 'enter-rx') {
      setStep('select-site');
      setSelectedSite(null);
    }
  };

  const handleGetConstraints = () => {
    setStep('view-results');
  };

  const constraints = useMemo(() => {
    if (!selectedSite || !dose || !fractions) return [];
    return getConstraintsForSiteAndFractionation(selectedSite.id, fractions);
  }, [selectedSite, fractions, dose]);

  return (
    <div className="min-h-screen">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent -z-10" />

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {step !== 'select-site' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors mr-2"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-slate-400" />
                </button>
              )}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-2 shadow-lg">
                  <BeakerIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  Dose Oracle
                  <SparklesIcon className="h-4 w-4 text-cyan-400" />
                </h1>
                <p className="text-xs text-slate-400">
                  Normal Tissue Dose Constraints
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showCalculator
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
                }`}
              >
                <CalculatorIcon className="h-4 w-4" />
                <span className="hidden sm:inline">BED Calculator</span>
              </button>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/?term=QUANTEC+radiotherapy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              >
                <BookOpenIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Sources</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Calculator Panel */}
      {showCalculator && (
        <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <DoseConverter />
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Treatment Site */}
        {step === 'select-site' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                What are you treating?
              </h2>
              <p className="text-lg text-slate-400">
                Select a treatment site to see all relevant OAR dose constraints
                from QUANTEC, HyTEC, and other authoritative sources.
              </p>
            </div>

            {/* Stats with glow */}
            <div className="flex justify-center gap-8">
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-3xl font-bold text-cyan-400 glow-text-blue">
                  {CONSTRAINTS.length}
                </div>
                <div className="text-sm text-slate-500">Constraints</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-3xl font-bold text-blue-400 glow-text-blue">
                  {new Set(CONSTRAINTS.map((c) => c.organ)).size}
                </div>
                <div className="text-sm text-slate-500">Organs</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-3xl font-bold text-purple-400">
                  {TREATMENT_SITES.length}
                </div>
                <div className="text-sm text-slate-500">Treatment Sites</div>
              </div>
            </div>

            <TreatmentSiteSelector
              selectedSite={selectedSite}
              onSelectSite={handleSelectSite}
            />
          </div>
        )}

        {/* Step 2: Enter Prescription */}
        {step === 'enter-rx' && selectedSite && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-cyan-400 font-medium bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full mb-4">
                <span>{selectedSite.icon}</span>
                {selectedSite.name}
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Enter your prescription
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                We&apos;ll show you all relevant constraints, automatically
                converted to your fractionation scheme.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* OAR Summary */}
              <div className="order-2 lg:order-1">
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Organs at Risk</h3>
                      <p className="text-xs text-slate-500">{selectedSite.relevantOrgans.length} structures will be evaluated</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedSite.relevantOrgans.map((organ, index) => {
                      const constraintCount = CONSTRAINTS.filter(c => c.organ === organ).length;
                      return (
                        <div
                          key={organ}
                          className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-700/30"
                          style={{ animationDelay: `${index * 0.03}s` }}
                        >
                          <span className="text-sm text-slate-300 truncate">{organ}</span>
                          <span className="text-xs text-slate-500 ml-2 shrink-0">
                            {constraintCount > 0 ? `${constraintCount}` : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500 text-center">
                      Constraints from QUANTEC, HyTEC, RTOG, UK SABR, PENTEC
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescription Input */}
              <div className="order-1 lg:order-2">
                <PrescriptionInput
                  dose={dose}
                  fractions={fractions}
                  onDoseChange={setDose}
                  onFractionsChange={setFractions}
                />

                <button
                  onClick={handleGetConstraints}
                  disabled={!dose || !fractions}
                  className="btn-glow w-full mt-6 py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none border border-blue-500/50"
                >
                  Get Dose Constraints
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: View Results */}
        {step === 'view-results' && selectedSite && (
          <div className="space-y-6">
            {/* Summary header */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-cyan-600/80" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
              <div className="relative p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                      <span>{selectedSite.icon}</span>
                      {selectedSite.name}
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      {dose} Gy in {fractions} fractions
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {(dose / fractions).toFixed(2)} Gy per fraction
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('enter-rx')}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors text-white border border-white/20"
                    >
                      Change Prescription
                    </button>
                    <button
                      onClick={() => {
                        setStep('select-site');
                        setSelectedSite(null);
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-white border border-white/10"
                    >
                      New Site
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <ConstraintResults
              constraints={constraints}
              userDose={dose}
              userFractions={fractions}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-400">Disclaimer:</strong> This tool is for educational and
              reference purposes only. Always verify constraints against primary
              sources and institutional protocols.
            </p>
            <p className="text-xs text-slate-600 mt-4">
              Data sources: QUANTEC (2010), HyTEC (2021-2024), AAPM TG-101, UK SABR Consortium v6.1, RTOG Protocols
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
