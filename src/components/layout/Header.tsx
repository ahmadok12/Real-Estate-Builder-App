import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { formatAedCompact } from '../../utils/formatters';
import { ShieldCheck, Download, RotateCcw } from 'lucide-react';

export const Header: React.FC<{ onOpenQuickAdd: () => void }> = () => {
  const { project, resetToDemoData, exportAuditData } = useAccounting();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 pt-3 pb-3">
      <div className="flex items-center justify-between">
        {/* Project ID Capsule */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-amber-400 font-bold text-base shadow-sm">
            B
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-extrabold text-slate-900 text-sm tracking-tight leading-none">
                {project.name}
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60 leading-none">
                DXB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
              {project.reraProjectId}
            </p>
          </div>
        </div>

        {/* Escrow Balance Pill & Actions */}
        <div className="flex items-center space-x-2">
          {/* Escrow Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <div className="text-[11px] font-bold text-emerald-900 leading-none">
              {formatAedCompact(project.escrowBalanceAed)}
            </div>
          </div>

          {/* Export JSON Audit */}
          <button
            onClick={exportAuditData}
            title="Download RERA Audit JSON"
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 pressable"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Reset Demo */}
          <button
            onClick={() => {
              if (window.confirm('Reset tower accounts to demo state?')) {
                resetToDemoData();
              }
            }}
            title="Reset to Demo State"
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 pressable"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
