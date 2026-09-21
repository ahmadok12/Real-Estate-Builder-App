import React from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { formatAed, formatAedCompact } from '../../utils/formatters';
import {
  TrendingUp,
  HardHat,
  Building2,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { TabType } from '../layout/MobileShell';

interface PulseViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenQuickAdd: () => void;
}

export const PulseView: React.FC<PulseViewProps> = ({ onNavigateTab, onOpenQuickAdd }) => {
  const { stats, transactions } = useAccounting();

  return (
    <div className="p-4 space-y-4">
      {/* Visual Concept Banner: Cost Management vs Unit Sales */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 p-3 rounded-2xl border border-amber-200/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
            P&L
          </div>
          <span className="font-semibold text-slate-800">
            Tower Cost vs Sales Accounting
          </span>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
          {stats.projectedMarginPercent}% Margin
        </span>
      </div>

      {/* Hero Master P&L Card */}
      <div className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-card relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Projected Builder Profit
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            Target GDV Margin
          </span>
        </div>

        {/* Big Profit Number */}
        <div className="my-2">
          <div className="text-3xl font-black text-emerald-700 tracking-tight">
            +{formatAed(stats.projectedProfitAed)}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 font-medium">
            Based on <span className="font-bold text-slate-800">{formatAedCompact(stats.salesGdvAed)} GDV</span> minus{' '}
            <span className="font-bold text-slate-800">{formatAedCompact(stats.totalCostBudgetAed)} Build Budget</span>
          </div>
        </div>

        {/* Formula Split Pill Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold block">Total Build Budget</span>
              <span className="text-sm font-extrabold text-slate-800">
                {formatAedCompact(stats.totalCostBudgetAed)}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                ~AED {stats.avgCostPerSqftAed}/sqft build
              </span>
            </div>

            <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
              <span className="text-[10px] text-emerald-800 font-semibold block">Realized Profit (Sold)</span>
              <span className="text-sm font-extrabold text-emerald-900">
                +{formatAedCompact(stats.realizedSoldProfitAed)}
              </span>
              <span className="text-[9px] text-emerald-700 block mt-0.5">
                From {stats.soldUnits} sold units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cashflow Matcher: Collections vs Construction Bills */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Cash Matching (Collections vs Costs)</span>
          </div>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              stats.isCashFlowPositive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {stats.isCashFlowPositive ? 'Self-Funding Surplus' : 'Deficit'}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold my-2">
          <span className="flex items-center gap-1 text-emerald-700">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Buyer Inflow: {formatAedCompact(stats.totalCollectedAed)}
          </span>
          <span className="flex items-center gap-1 text-rose-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Cost Outflow: {formatAedCompact(stats.totalCostSpentAed)}
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 rounded-l-full"
            style={{
              width: `${Math.min(100, (stats.totalCollectedAed / stats.salesGdvAed) * 100)}%`,
            }}
          />
          <div
            className="h-full bg-rose-500"
            style={{
              width: `${Math.min(100, (stats.totalCostSpentAed / stats.salesGdvAed) * 100)}%`,
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
          <span className="text-slate-500">Net Project Cash Buffer:</span>
          <span className="font-extrabold text-emerald-700">
            +{formatAedCompact(stats.cashCoverageSurplusAed)}
          </span>
        </div>
      </div>

      {/* Dual Center Quick Nav: Cost vs Sales */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cost Management Center */}
        <button
          onClick={() => onNavigateTab('build')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-card text-left pressable hover:border-amber-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <HardHat className="w-3.5 h-3.5 text-amber-600" />
                <span>Build Costs</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="text-lg font-black text-slate-900 mt-1">
              {formatAedCompact(stats.totalCostSpentAed)}
            </div>
            <div className="text-[10px] text-slate-400">
              of {formatAedCompact(stats.totalCostBudgetAed)} Budget
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
              <span>Budget Burn</span>
              <span className="text-slate-800 font-bold">{stats.costBurnPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${stats.costBurnPercent}%` }}
              />
            </div>
          </div>
        </button>

        {/* Unit Sales Center */}
        <button
          onClick={() => onNavigateTab('tower')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-card text-left pressable hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unit Sales</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="text-lg font-black text-slate-900 mt-1">
              {formatAedCompact(stats.salesSoldVolumeAed)}
            </div>
            <div className="text-[10px] text-slate-400">
              {stats.soldUnits} / {stats.totalUnits} Units Sold
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
              <span>Sold Rate</span>
              <span className="text-slate-800 font-bold">
                {Math.round((stats.soldUnits / stats.totalUnits) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${(stats.soldUnits / stats.totalUnits) * 100}%` }}
              />
            </div>
          </div>
        </button>
      </div>

      {/* Recent Cost & Sales Stream */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800">Cost & Sales Transaction Ledger</span>
          <span className="text-[10px] text-slate-400">Live</span>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 4).map(tx => (
            <div key={tx.id} className="py-2 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[210px]">
                  {tx.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{tx.timestamp}</p>
              </div>
              <span
                className={`font-mono font-bold text-xs ${
                  tx.type === 'INFLOW_SALES' ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {tx.type === 'INFLOW_SALES' ? '+' : '-'}
                {formatAedCompact(tx.amountAed)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
