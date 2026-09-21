import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { formatAed } from '../../utils/formatters';
import { X, HardHat, Check } from 'lucide-react';

interface NewIpcModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewIpcModal: React.FC<NewIpcModalProps> = ({ isOpen, onClose }) => {
  const { addNewIpc, project, ipcs } = useAccounting();

  const [period, setPeriod] = useState(`IPC #0${ipcs.length + 1} - Superstructure`);
  const [claimGross, setClaimGross] = useState('14500000');
  const [certifiedPercent, setCertifiedPercent] = useState('95');
  const [retentionRate] = useState('10');
  const [vatRate] = useState('5');

  if (!isOpen) return null;

  const grossNum = parseFloat(claimGross) || 0;
  const certPctNum = parseFloat(certifiedPercent) || 0;
  const certGross = Math.round(grossNum * (certPctNum / 100));
  const retDed = Math.round(certGross * ((parseFloat(retentionRate) || 10) / 100));
  const taxable = certGross - retDed;
  const vatAmount = Math.round(taxable * ((parseFloat(vatRate) || 5) / 100));
  const netPayable = taxable + vatAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grossNum <= 0) return;

    addNewIpc({
      ipcNumber: `IPC #0${ipcs.length + 1}`,
      period,
      contractorName: project.contractorName,
      claimGrossAed: grossNum,
      certifiedGrossAed: certGross,
      certifiedProgressPercent: certPctNum,
      retentionPercent: parseFloat(retentionRate) || 10,
      vatPercent: parseFloat(vatRate) || 5,
      dateSubmitted: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-sheet p-4 sheet-enter">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900">
            <HardHat className="w-4 h-4 text-amber-600" />
            <span>File Contractor IPC</span>
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
              Certificate Title / Milestone
            </label>
            <input
              type="text"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Claim Gross (AED)
              </label>
              <input
                type="number"
                value={claimGross}
                onChange={e => setClaimGross(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Engineer Certified %
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={certifiedPercent}
                onChange={e => setCertifiedPercent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Auto Breakdown Preview */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Certified Gross:</span>
              <span className="font-bold text-slate-900">{formatAed(certGross)}</span>
            </div>
            <div className="flex justify-between text-amber-900 font-semibold">
              <span>- 10% Retention Withheld:</span>
              <span>-{formatAed(retDed)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>+ 5% UAE VAT:</span>
              <span className="font-bold">+{formatAed(vatAmount)}</span>
            </div>
            <div className="pt-1.5 border-t border-amber-200/80 flex justify-between font-black text-sm text-slate-900">
              <span>Net Escrow Disbursement:</span>
              <span className="text-emerald-700">{formatAed(netPayable)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-extrabold text-xs shadow-md pressable flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Submit Certified Certificate</span>
          </button>
        </form>
      </div>
    </div>
  );
};
