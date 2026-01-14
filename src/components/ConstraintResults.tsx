'use client';

import { useState } from 'react';
import { Constraint } from '@/lib/types';
import { convertConstraintToNewFractionation, formatDose } from '@/lib/calculations';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

interface ConstraintResultsProps {
  constraints: Constraint[];
  userDose: number;
  userFractions: number;
}

function EvidenceBadge({ level }: { level: string }) {
  const config: Record<string, { bg: string; text: string; glow: string }> = {
    A: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    B: { bg: 'bg-blue-500/20', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    C: { bg: 'bg-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    D: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/20' },
  };

  const descriptions: Record<string, string> = {
    A: 'Strong evidence from prospective trials',
    B: 'Moderate evidence from large studies',
    C: 'Limited evidence, expert consensus',
    D: 'Very limited data',
  };

  const c = config[level] || config.C;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border border-current/20 ${c.bg} ${c.text}`}
      title={descriptions[level]}
    >
      Grade {level}
    </span>
  );
}

function RiskIndicator({ risk }: { risk: string | undefined }) {
  if (!risk) return null;

  const isLow = risk.includes('< 1') || risk.includes('< 3') || risk.includes('< 5');
  const isMedium = risk.includes('< 10') || risk.includes('< 15') || risk.includes('< 20');
  const isHigh = !isLow && !isMedium;

  const Icon = isLow ? ShieldCheckIcon : isHigh ? ShieldExclamationIcon : ExclamationTriangleIcon;
  const colorClass = isLow ? 'text-emerald-400' : isHigh ? 'text-red-400' : 'text-amber-400';

  return (
    <div className={`flex items-center gap-1.5 ${colorClass}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{risk}</span>
    </div>
  );
}

function SourceLinks({ source }: { source: Constraint['source'] }) {
  const pubmedUrl = source.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${source.pmid}/` : null;
  const doiUrl = source.doi ? `https://doi.org/${source.doi}` : null;

  return (
    <div className="flex items-center gap-3">
      {/* Source name - clickable if PubMed available */}
      {pubmedUrl ? (
        <a
          href={pubmedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
        >
          <DocumentTextIcon className="h-4 w-4" />
          <span className="group-hover:underline">{source.shortName}</span>
          <span className="text-slate-500">({source.year})</span>
          <ArrowTopRightOnSquareIcon className="h-3 w-3 opacity-50 group-hover:opacity-100" />
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
          <DocumentTextIcon className="h-4 w-4" />
          <span>{source.shortName}</span>
          <span className="text-slate-500">({source.year})</span>
        </span>
      )}

      {/* DOI link */}
      {doiUrl && (
        <a
          href={doiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-700/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded transition-colors"
          title="View via DOI"
        >
          <LinkIcon className="h-3 w-3" />
          DOI
        </a>
      )}

      {/* PubMed badge */}
      {pubmedUrl && (
        <a
          href={pubmedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
          title="View on PubMed"
        >
          PubMed
        </a>
      )}
    </div>
  );
}

function CopyAllButton({ constraints, userDose, userFractions }: { constraints: Constraint[], userDose: number, userFractions: number }) {
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let text = `DOSE CONSTRAINTS\n`;
    text += `Prescription: ${userDose} Gy in ${userFractions} fractions (${(userDose/userFractions).toFixed(2)} Gy/fx)\n`;
    text += '─'.repeat(60) + '\n\n';

    const grouped: Record<string, Constraint[]> = {};
    for (const c of constraints) {
      if (!grouped[c.organ]) grouped[c.organ] = [];
      grouped[c.organ].push(c);
    }

    for (const [organ, cons] of Object.entries(grouped)) {
      text += `▸ ${organ}\n`;
      for (const c of cons) {
        const metric = c.metricDetail ? `${c.metric} (${c.metricDetail})` : c.metric;
        text += `  ${metric}: < ${c.limit} ${c.limitUnit}`;
        if (c.riskAtLimit) text += ` [Risk: ${c.riskAtLimit}]`;
        text += `\n  Source: ${c.source.citation}\n\n`;
      }
    }

    text += '\nGenerated by Dose Oracle - https://dose-oracle.vercel.app';
    return text;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-all border border-slate-700 hover:border-slate-600"
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <ClipboardDocumentIcon className="h-4 w-4" />
          Export All
        </>
      )}
    </button>
  );
}

function OrganCard({
  organ,
  constraints,
  userDose,
  userFractions,
}: {
  organ: string;
  constraints: Constraint[];
  userDose: number;
  userFractions: number;
}) {
  const [expanded, setExpanded] = useState(true);

  const sortedConstraints = [...constraints].sort((a, b) => {
    if (a.metric !== b.metric) return a.metric.localeCompare(b.metric);
    return a.limit - b.limit;
  });

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/80 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white">{organ}</h3>
          <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-400 rounded-full">
            {constraints.length} constraint{constraints.length !== 1 ? 's' : ''}
          </span>
        </div>
        {expanded ? (
          <ChevronUpIcon className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="divide-y divide-slate-700/50">
          {sortedConstraints.map((constraint) => (
            <ConstraintRow
              key={constraint.id}
              constraint={constraint}
              userDose={userDose}
              userFractions={userFractions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ConstraintRow({
  constraint,
  userDose,
  userFractions,
}: {
  constraint: Constraint;
  userDose: number;
  userFractions: number;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const metric = constraint.metricDetail
    ? `${constraint.metric} (${constraint.metricDetail})`
    : constraint.metric;

  // Calculate converted constraint if fractionation differs
  let convertedLimit: number | null = null;
  let showConversion = false;

  if (constraint.fractionation === 'sbrt' && constraint.fractions) {
    if (constraint.fractions !== userFractions && userFractions <= 10) {
      showConversion = true;
      convertedLimit = convertConstraintToNewFractionation(
        constraint.limit,
        constraint.fractions,
        userFractions,
        constraint.alphaBeta
      );
    }
  }

  return (
    <div className="px-6 py-5 hover:bg-slate-800/50 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Main constraint display */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {/* Original constraint */}
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono font-bold text-white bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700">
                {metric} &lt; {constraint.limit} {constraint.limitUnit}
              </code>
              {constraint.fractionation === 'sbrt' && constraint.fractions && (
                <span className="text-xs text-slate-500">
                  ({constraint.fractions}fx)
                </span>
              )}
            </div>

            {/* Converted constraint */}
            {showConversion && convertedLimit && (
              <>
                <span className="text-slate-600">→</span>
                <code className="text-lg font-mono font-bold text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30">
                  &lt; {formatDose(convertedLimit)} {constraint.limitUnit}
                  <span className="text-sm ml-2 text-cyan-300/70">
                    ({userFractions}fx)
                  </span>
                </code>
              </>
            )}
          </div>

          {/* Endpoint */}
          <div className="text-slate-400 mb-3">
            {constraint.endpoint}
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-4">
            <RiskIndicator risk={constraint.riskAtLimit} />
            <EvidenceBadge level={constraint.evidenceLevel} />

            <SourceLinks source={constraint.source} />

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors ml-auto"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          </div>

          {/* Expanded details */}
          {showDetails && (
            <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 space-y-3">
              {constraint.notes && (
                <p className="text-sm text-slate-400">
                  <span className="text-slate-500 font-medium">Notes:</span> {constraint.notes}
                </p>
              )}
              <p className="text-sm text-slate-400">
                <span className="text-slate-500 font-medium">α/β ratio:</span> {constraint.alphaBeta} Gy
              </p>

              {/* Full citation with links */}
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 font-medium mb-2">Full Citation:</p>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  {constraint.source.citation}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {constraint.source.pmid && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${constraint.source.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      View on PubMed
                      <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                    </a>
                  )}
                  {constraint.source.doi && (
                    <a
                      href={`https://doi.org/${constraint.source.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                      View via DOI
                      <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                    </a>
                  )}
                  {!constraint.source.pmid && !constraint.source.doi && (
                    <span className="text-xs text-slate-500 italic">
                      No direct link available — search citation manually
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ConstraintResults({
  constraints,
  userDose,
  userFractions,
}: ConstraintResultsProps) {
  if (constraints.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
        <ExclamationTriangleIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg">
          No constraints found for this configuration.
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Try adjusting your fractionation or selecting a different treatment site.
        </p>
      </div>
    );
  }

  // Group by organ
  const grouped: Record<string, Constraint[]> = {};
  for (const c of constraints) {
    if (!grouped[c.organ]) {
      grouped[c.organ] = [];
    }
    grouped[c.organ].push(c);
  }

  const sortedOrgans = Object.keys(grouped).sort();

  // Get unique sources
  const uniqueSources = Array.from(
    new Map(constraints.map(c => [c.source.name, c.source])).values()
  ).sort((a, b) => a.shortName.localeCompare(b.shortName));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Relevant Constraints
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {constraints.length} constraints across {sortedOrgans.length} organs
          </p>
        </div>
        <CopyAllButton
          constraints={constraints}
          userDose={userDose}
          userFractions={userFractions}
        />
      </div>

      <div className="space-y-4">
        {sortedOrgans.map((organ) => (
          <OrganCard
            key={organ}
            organ={organ}
            constraints={grouped[organ]}
            userDose={userDose}
            userFractions={userFractions}
          />
        ))}
      </div>

      {/* Sources Summary */}
      <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <DocumentTextIcon className="h-4 w-4 text-blue-400" />
          Sources Referenced ({uniqueSources.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {uniqueSources.map((source) => (
            <div
              key={source.name}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-300 truncate">{source.shortName}</p>
                <p className="text-xs text-slate-500">{source.year}</p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {source.pmid && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${source.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                    title="PubMed"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                )}
                {source.doi && (
                  <a
                    href={`https://doi.org/${source.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                    title="DOI"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">
          Click any source to view the original publication
        </p>
      </div>
    </div>
  );
}
