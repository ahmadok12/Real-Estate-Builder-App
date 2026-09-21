import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { formatAed, formatAedCompact, formatShortDate } from '../../utils/formatters';
import {
  Coins,
  CheckCircle,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PdcFinanceView: React.FC = () => {
  const { pdcs, stats, updatePdcStatus, exportAuditData } = useAccounting();
  const [filter, setFilter] = useState<'All' | 'In Hand' | 'Deposited' | 'Cleared'>('All');

  const filteredPdcs = pdcs.filter(p => (filter === 'All' ? true : p.status === filter));

  const handleClearPdc = (pdcId: string) => {
    updatePdcStatus(pdcId, 'Cleared');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#059669', '#10B981']
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Finance Overview Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>PDCs & Escrow Cashflow</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            UAE Compliant
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block">Cleared PDCs</span>
            <span className="text-base font-black text-slate-900">
              {formatAedCompact(stats.maturedPdcAed)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <span className="text-[10px] text-amber-800 font-semibold block">Upcoming PDCs</span>
            <span className="text-base font-black text-amber-900">
              {formatAedCompact(stats.upcomingPdcAed)}
            </span>
          </div>
        </div>

        {/* Audit Download CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">RERA Escrow Audit Export</div>
            <div className="text-[10px] text-slate-400">Statement of Account & Bank Ledger</div>
          </div>
          <button
            onClick={exportAuditData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold shadow-sm pressable"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* UAE VAT & DLD Regulation Summary */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <span>5% UAE VAT Recoverable</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-1">
            {formatAedCompact(stats.inputVatAed)}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">FTA Input Credit</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
            <span>DLD 4% Govt Fees</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-1">
            {formatAedCompact(stats.salesSoldVolumeAed * 0.04)}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">Direct DLD Remittance</span>
        </div>
      </div>

      {/* Post-Dated Cheques Pipeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-800">Post-Dated Cheques (PDCs)</span>
          <span className="text-[11px] text-slate-400 font-medium">{filteredPdcs.length} Cheques</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['All', 'In Hand', 'Deposited', 'Cleared'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all pressable ${
                filter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cheque List */}
        <div className="space-y-2.5">
          {filteredPdcs.map(pdc => (
            <div
              key={pdc.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-card space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-slate-900">{pdc.drawerName}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Unit {pdc.unitNumber} • {pdc.bankName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-slate-900">
                    {formatAed(pdc.amountAed)}
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      pdc.status === 'Cleared'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pdc.status === 'Deposited'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {pdc.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-mono text-[10px]">{pdc.chequeNumber}</span>
                <span>Due: {formatShortDate(pdc.dueDate)}</span>
              </div>

              {/* Action Buttons */}
              {pdc.status === 'In Hand' && (
                <button
                  onClick={() => updatePdcStatus(pdc.id, 'Deposited')}
                  className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold pressable"
                >
                  Deposit into Escrow Bank
                </button>
              )}

              {pdc.status === 'Deposited' && (
                <button
                  onClick={() => handleClearPdc(pdc.id)}
                  className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 pressable shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Cleared (+{formatAedCompact(pdc.amountAed)} to Escrow)</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
