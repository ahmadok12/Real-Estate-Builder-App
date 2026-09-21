import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { X, Coins, HardHat, Receipt, Check } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIpcModal: () => void;
  onOpenCostModal: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onOpenIpcModal,
  onOpenCostModal
}) => {
  const { addPdc, units } = useAccounting();
  const [activeForm, setActiveForm] = useState<'menu' | 'pdc'>('menu');

  // PDC Form states
  const [drawerName, setDrawerName] = useState('');
  const [unitNumber, setUnitNumber] = useState(units[0]?.unitNumber || 'L12-01');
  const [amountAed, setAmountAed] = useState('250000');
  const [bankName, setBankName] = useState('Emirates NBD');
  const [dueDate, setDueDate] = useState('2026-11-15');

  if (!isOpen) return null;

  const handleCreatePdc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerName || !amountAed) return;

    addPdc({
      chequeNumber: `CHQ-${Math.floor(10000 + Math.random() * 90000)}`,
      bankName,
      drawerName,
      unitNumber,
      amountAed: parseFloat(amountAed) || 0,
      dueDate,
      status: 'In Hand',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-sheet p-4 sheet-enter">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-extrabold text-sm text-slate-900">
            {activeForm === 'menu' ? 'Quick Builder Actions' : 'Log New Post-Dated Cheque'}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 pressable"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {activeForm === 'menu' ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {/* Action 1: Log Construction Cost */}
            <button
              onClick={() => {
                onClose();
                onOpenCostModal();
              }}
              className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-left pressable hover:bg-amber-100/50 flex flex-col justify-between"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mb-2">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Log Build Cost</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Concrete, steel, trades</div>
              </div>
            </button>

            {/* Action 2: Receive PDC */}
            <button
              onClick={() => setActiveForm('pdc')}
              className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-left pressable hover:bg-emerald-100/50 flex flex-col justify-between"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">Receive PDC</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Buyer installment chq</div>
              </div>
            </button>

            {/* Action 3: File Contractor IPC */}
            <button
              onClick={() => {
                onClose();
                onOpenIpcModal();
              }}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left pressable hover:bg-slate-100 flex flex-col justify-between"
            >
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold mb-2">
                <HardHat className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">File IPC</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Contractor claim</div>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreatePdc} className="mt-3 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Buyer / Drawer Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rashid Al Mansoori"
                value={drawerName}
                onChange={e => setDrawerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Unit Number
                </label>
                <select
                  value={unitNumber}
                  onChange={e => setUnitNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {units.slice(0, 15).map(u => (
                    <option key={u.id} value={u.unitNumber}>
                      {u.unitNumber} ({u.type})
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
                  Drawer Bank
                </label>
                <select
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="Emirates NBD">Emirates NBD</option>
                  <option value="First Abu Dhabi Bank (FAB)">FAB</option>
                  <option value="Mashreq Bank">Mashreq</option>
                  <option value="Dubai Islamic Bank (DIB)">DIB</option>
                  <option value="Abu Dhabi Commercial Bank (ADCB)">ADCB</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Maturity / Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-extrabold text-xs shadow-md pressable flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Post-Dated Cheque</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
