import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { formatAed, formatAedCompact, formatShortDate } from '../../utils/formatters';
import {
  HardHat,
  ShieldCheck,
  Plus,
  Lock,
  Layers,
  Receipt,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CapexViewProps {
  onOpenNewIpc: () => void;
  onOpenNewCost: () => void;
}

export const CapexView: React.FC<CapexViewProps> = ({ onOpenNewIpc, onOpenNewCost }) => {
  const {
    budgetCategories,
    constructionExpenses,
    ipcs,
    stats,
    project,
    approveIpc
  } = useAccounting();

  const [activeTab, setActiveTab] = useState<'categories' | 'expenses' | 'ipcs'>('categories');

  const handleApproveIpc = (ipcId: string) => {
    approveIpc(ipcId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#059669', '#D97706', '#0F172A']
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* CAPEX Summary Header Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <HardHat className="w-4 h-4 text-amber-600" />
            <span>Construction Cost Management</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            ~AED {stats.avgCostPerSqftAed}/sqft
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block">Total Cost Budget</span>
            <span className="text-base font-black text-slate-900">
              {formatAedCompact(stats.totalCostBudgetAed)}
            </span>
            <span className="text-[9px] text-slate-500">Authorized build cap</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <span className="text-[10px] text-amber-800 font-semibold block">Actual Spent to Date</span>
            <span className="text-base font-black text-amber-900">
              {formatAedCompact(stats.totalCostSpentAed)}
            </span>
            <span className="text-[9px] text-amber-700">
              {stats.costBurnPercent}% budget consumed
            </span>
          </div>
        </div>

        {/* View Mode Toggle: 3 Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mt-3">
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all pressable ${
              activeTab === 'categories' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            Budgets ({budgetCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all pressable ${
              activeTab === 'expenses' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            Invoices ({constructionExpenses.length})
          </button>
          <button
            onClick={() => setActiveTab('ipcs')}
            className={`py-1.5 text-[11px] font-bold rounded-lg transition-all pressable ${
              activeTab === 'ipcs' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
            }`}
          >
            IPCs ({ipcs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Cost by Trade Category */}
      {activeTab === 'categories' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">Cost Breakdown by Trade Category</span>
            <button
              onClick={onOpenNewCost}
              className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 pressable"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Cost</span>
            </button>
          </div>

          {budgetCategories.map(cat => {
            const spentPct = Math.round((cat.actualSpentAed / cat.budgetAed) * 100);
            return (
              <div
                key={cat.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-card space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">{cat.category}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {spentPct}% spent
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">
                    Spent: <strong className="text-slate-900">{formatAedCompact(cat.actualSpentAed)}</strong>
                  </span>
                  <span className="text-slate-400">
                    Budget: {formatAedCompact(cat.budgetAed)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      spentPct > 90 ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, spentPct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Vendor Invoices / Direct Expenses */}
      {activeTab === 'expenses' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">Material & Subcontractor Invoices</span>
            <button
              onClick={onOpenNewCost}
              className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 pressable"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Cost</span>
            </button>
          </div>

          {constructionExpenses.map(exp => (
            <div
              key={exp.id}
              className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-card flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900">{exp.vendorName}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                    {exp.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{exp.description}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">
                  {exp.invoiceNumber} • {formatShortDate(exp.date)}
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-xs text-slate-900">
                  {formatAed(exp.amountAed)}
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block mt-0.5">
                  {exp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Contractor IPCs */}
      {activeTab === 'ipcs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">Contractor Interim Payment Certificates</span>
            <button
              onClick={onOpenNewIpc}
              className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 pressable"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File IPC</span>
            </button>
          </div>

          {ipcs.map(ipc => (
            <div
              key={ipc.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">{ipc.ipcNumber}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{ipc.period}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Ref: {ipc.engineerCertificateRef || 'Under Review'}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    ipc.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ipc.status === 'Certified'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ipc.status === 'Paid' ? 'Paid from Escrow' : ipc.status}
                </span>
              </div>

              {/* Accounting Breakdown */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Gross Claim</span>
                  <span className="font-semibold text-slate-800">{formatAed(ipc.certifiedGrossAed)}</span>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Less 10% Retention
                  </span>
                  <span className="font-semibold">-{formatAed(ipc.retentionDeductionAed)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Plus 5% UAE VAT</span>
                  <span className="font-semibold">+{formatAed(ipc.vatAmountAed)}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Net Escrow Release</span>
                  <span className="text-emerald-700">{formatAed(ipc.netPayableAed)}</span>
                </div>
              </div>

              {ipc.status === 'Certified' && (
                <button
                  onClick={() => handleApproveIpc(ipc.id)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm pressable"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Release {formatAedCompact(ipc.netPayableAed)} from Escrow</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
