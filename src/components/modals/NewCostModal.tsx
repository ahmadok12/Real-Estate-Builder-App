import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { CostCategory } from '../../types/accounting';
import { X, HardHat, Check } from 'lucide-react';

interface NewCostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCostModal: React.FC<NewCostModalProps> = ({ isOpen, onClose }) => {
  const { addConstructionExpense, budgetCategories } = useAccounting();

  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState<CostCategory>('Structure & Civil');
  const [amountAed, setAmountAed] = useState('850000');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('Reinforcement steel delivery & testing');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !amountAed) return;

    addConstructionExpense({
      invoiceNumber,
      vendorName,
      category,
      amountAed: parseFloat(amountAed) || 0,
      date: new Date().toISOString().split('T')[0],
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-sheet p-4 sheet-enter">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900">
            <HardHat className="w-4 h-4 text-amber-600" />
            <span>Log Construction Cost / Invoice</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 pressable"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Vendor / Subcontractor Name
            </label>
            <input
              type="text"
              placeholder="e.g. Emirates Steel, ReadyMix Dubai"
              value={vendorName}
              onChange={e => setVendorName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Cost Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CostCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
              >
                {budgetCategories.map(b => (
                  <option key={b.id} value={b.category}>
                    {b.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Amount (AED)
              </label>
              <input
                type="number"
                value={amountAed}
                onChange={e => setAmountAed(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Invoice Reference #
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Description / Scope
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-extrabold text-xs shadow-md pressable flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Record Construction Expense</span>
          </button>
        </form>
      </div>
    </div>
  );
};
