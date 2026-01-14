'use client';

import { useState } from 'react';
import { Constraint } from '@/lib/types';
import { getEvidenceLevelDescription } from '@/lib/search';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface ConstraintTableProps {
  constraints: Constraint[];
}

function EvidenceBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    A: 'bg-emerald-100 text-emerald-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-amber-100 text-amber-800',
    D: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[level] || 'bg-slate-100 text-slate-800'}`}
      title={getEvidenceLevelDescription(level)}
    >
      {level}
    </span>
  );
}

function FractionationBadge({ constraint }: { constraint: Constraint }) {
  if (constraint.fractionation === 'conventional') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
        Conventional
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
      SBRT {constraint.fractions ? `${constraint.fractions}fx` : ''}
    </span>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
      title={`Copy ${label}`}
    >
      {copied ? (
        <>
          <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-500">Copied</span>
        </>
      ) : (
        <>
          <ClipboardDocumentIcon className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function ConstraintRow({ constraint }: { constraint: Constraint }) {
  const [expanded, setExpanded] = useState(false);

  const formatLimit = () => {
    const metricDisplay = constraint.metricDetail
      ? `${constraint.metric} (${constraint.metricDetail})`
      : constraint.metric;
    return `${metricDisplay} < ${constraint.limit} ${constraint.limitUnit}`;
  };

  const citationText = constraint.source.citation;

  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-4 py-3">
          <div className="font-medium text-slate-900">{constraint.organ}</div>
          <div className="text-xs text-slate-500">{constraint.structure}</div>
        </td>
        <td className="px-4 py-3">
          <code className="text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">
            {formatLimit()}
          </code>
        </td>
        <td className="px-4 py-3 text-sm text-slate-600">{constraint.endpoint}</td>
        <td className="px-4 py-3">
          <FractionationBadge constraint={constraint} />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <EvidenceBadge level={constraint.evidenceLevel} />
            {constraint.riskAtLimit && (
              <span className="text-xs text-slate-500">{constraint.riskAtLimit}</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <span className="text-sm text-slate-600">{constraint.source.shortName}</span>
            {constraint.source.pmid && (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${constraint.source.pmid}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
                title="View on PubMed"
              >
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Show details"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50">
          <td colSpan={7} className="px-4 py-3">
            <div className="space-y-2">
              {constraint.notes && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Notes:</span> {constraint.notes}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  <span className="font-medium">α/β:</span> {constraint.alphaBeta} Gy
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-600">Citation:</span>
                <span className="text-slate-500 italic">{citationText}</span>
                <CopyButton text={citationText} label="citation" />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function ConstraintTable({ constraints }: ConstraintTableProps) {
  if (constraints.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No constraints found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Organ
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Constraint
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Endpoint
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Fractionation
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Evidence
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Source
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-12">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {constraints.map((constraint) => (
            <ConstraintRow key={constraint.id} constraint={constraint} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
