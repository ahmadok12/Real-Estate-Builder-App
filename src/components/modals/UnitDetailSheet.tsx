import React, { useState } from 'react';
import type { TowerUnit } from '../../types/accounting';
import { useAccounting } from '../../context/AccountingContext';
import { formatAed, formatAedCompact, formatShortDate } from '../../utils/formatters';
import {
  X,
  CheckCircle,
  User,
  Phone,
  Coins,
  TrendingUp,
  HardHat
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UnitDetailSheetProps {
  unit: TowerUnit | null;
  onClose: () => void;
}

export const UnitDetailSheet: React.FC<UnitDetailSheetProps> = ({ unit, onClose }) => {
  const { markInstallmentPaid, updateUnitStatus } = useAccounting();
  const [buyerInput, setBuyerInput] = useState('');
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);

  if (!unit) return null;

  const handlePayInstallment = (installmentId: string) => {
    markInstallmentPaid(unit.id, installmentId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#059669', '#10B981', '#F59E0B']
    });
  };

  const handleSaveBuyer = () => {
    if (buyerInput.trim()) {
      updateUnitStatus(unit.id, 'Reserved', buyerInput.trim());
      setIsEditingBuyer(false);
      setBuyerInput('');
    }
  };

  const paidPercent = Math.round((unit.totalCollectedAed / unit.priceAed) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
      <div
        className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-sheet max-h-[85vh] flex flex-col sheet-enter overflow-hidden"
      >
        {/* Pull Handle & Close Button */}
        <div className="pt-2 px-4 pb-2 flex items-center justify-between border-b border-slate-100">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 pressable"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-4">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{unit.unitNumber}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    unit.status === 'Sold'
                      ? 'bg-emerald-100 text-emerald-800'
                      : unit.status === 'Reserved'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {unit.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Floor {unit.floor} • {unit.type} • {unit.areaSqft} sqft
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-black text-slate-900">
                {formatAed(unit.priceAed)}
              </div>
              <div className="text-[10px] text-slate-400">
                DLD 4%: {formatAedCompact(unit.dldFeeAed)}
              </div>
            </div>
          </div>

          {/* Unit Cost vs Sales P&L Card */}
          <div className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unit Profit & Loss (P&L)</span>
              </span>
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                {unit.profitMarginPercent}% Margin
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Selling Price</span>
                <span className="font-extrabold text-slate-900">{formatAedCompact(unit.priceAed)}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  AED {Math.round(unit.priceAed / unit.areaSqft)}/sqft
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Build Cost</span>
                <span className="font-extrabold text-slate-700">-{formatAedCompact(unit.allocatedCostAed)}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  AED {Math.round(unit.allocatedCostAed / unit.areaSqft)}/sqft
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-extrabold">
              <span className="text-slate-700">Developer Profit:</span>
              <span className="text-emerald-700 text-sm">+{formatAed(unit.projectedProfitAed)}</span>
            </div>
          </div>

          {/* Buyer Details Capsule */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700">Buyer Information</span>
              {!isEditingBuyer && (
                <button
                  onClick={() => setIsEditingBuyer(true)}
                  className="text-[10px] font-bold text-amber-700 hover:text-amber-800"
                >
                  {unit.buyerName ? 'Edit' : '+ Assign Buyer'}
                </button>
              )}
            </div>

            {isEditingBuyer ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buyer Full Name"
                  value={buyerInput}
                  onChange={e => setBuyerInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSaveBuyer}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : unit.buyerName ? (
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{unit.buyerName}</span>
                  {unit.buyerNationality && (
                    <span className="text-[10px] font-medium text-slate-400">
                      ({unit.buyerNationality})
                    </span>
                  )}
                </div>
                {unit.buyerPhone && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{unit.buyerPhone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No buyer assigned yet (Unit Available)</p>
            )}
          </div>

          {/* Collection Status Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-600">Buyer Payment Progress</span>
              <span className="text-emerald-700">
                {formatAedCompact(unit.totalCollectedAed)} ({paidPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${paidPercent}%` }}
              />
            </div>
          </div>

          {/* Installment Milestone Schedule */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800">Installment Milestone Plan</span>

            <div className="space-y-2">
              {unit.paymentPlan.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-800">{item.milestoneTitle}</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        ({item.percentage}%)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Due: {formatShortDate(item.dueDate)}
                      {item.receiptNumber && ` • ${item.receiptNumber}`}
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <div className="font-bold text-xs text-slate-900">
                      {formatAedCompact(item.amountAed)}
                    </div>

                    {item.status === 'Paid' ? (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayInstallment(item.id)}
                        className="text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg pressable shadow-xs"
                      >
                        Collect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
