import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import type { TowerUnit } from '../../types/accounting';
import { formatAedCompact } from '../../utils/formatters';
import {
  Box,
  Layers,
  LayoutGrid,
  UserCheck,
  CheckCircle,
  TrendingUp,
  X,
  ExternalLink
} from 'lucide-react';
import { Tower3DCanvas } from './Tower3DCanvas';
import { Tower2DFacade } from './Tower2DFacade';

interface TowerElevationViewProps {
  onSelectUnit: (unit: TowerUnit) => void;
}

export const TowerElevationView: React.FC<TowerElevationViewProps> = ({ onSelectUnit }) => {
  const { units, stats } = useAccounting();

  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'cards'>('3d');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Sold' | 'Partial' | 'Vacant'>('All');
  const [activeInspectedUnit, setActiveInspectedUnit] = useState<TowerUnit | null>(null);

  // Counts for the 3 distinct categories
  const soldCount = units.filter(u => u.status === 'Sold' || u.status === 'HandedOver').length;
  const partialCount = units.filter(u => u.status === 'Reserved').length;
  const vacantCount = units.filter(u => u.status === 'Available').length;

  const handleUnitPick = (unit: TowerUnit) => {
    setActiveInspectedUnit(unit);
  };

  const handleOpenFullDetail = (unit: TowerUnit) => {
    onSelectUnit(unit);
  };

  return (
    <div className="p-4 space-y-4">
      {/* View Mode Segmented Control: 3D vs 2D vs Cards */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setViewMode('3d')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all pressable ${
            viewMode === '3d'
              ? 'bg-slate-900 text-amber-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Orbit</span>
        </button>

        <button
          onClick={() => setViewMode('2d')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all pressable ${
            viewMode === '2d'
              ? 'bg-slate-900 text-amber-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Facade</span>
        </button>

        <button
          onClick={() => setViewMode('cards')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all pressable ${
            viewMode === 'cards'
              ? 'bg-slate-900 text-amber-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Unit Cards</span>
        </button>
      </div>

      {/* Color Coding Legend Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all pressable ${
            statusFilter === 'All'
              ? 'bg-slate-800 text-white'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          All ({units.length})
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Sold' ? 'All' : 'Sold')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all pressable ${
            statusFilter === 'Sold'
              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Sold ({soldCount})
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Partial' ? 'All' : 'Partial')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all pressable ${
            statusFilter === 'Partial'
              ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Partial Paid ({partialCount})
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Vacant' ? 'All' : 'Vacant')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all pressable ${
            statusFilter === 'Vacant'
              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          Vacant ({vacantCount})
        </button>
      </div>

      {/* Active Inspected Unit HUD Card (Floating Preview) */}
      {activeInspectedUnit && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl space-y-2 border border-slate-700 sheet-enter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-amber-400">
                {activeInspectedUnit.unitNumber}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Floor {activeInspectedUnit.floor} • {activeInspectedUnit.type} • {activeInspectedUnit.areaSqft} sqft
              </span>
            </div>
            <button
              onClick={() => setActiveInspectedUnit(null)}
              className="text-slate-400 hover:text-white pressable"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Selling Price</span>
              <span className="font-extrabold text-white">
                {formatAedCompact(activeInspectedUnit.priceAed)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Build Cost</span>
              <span className="font-extrabold text-slate-300">
                -{formatAedCompact(activeInspectedUnit.allocatedCostAed)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 block">Profit</span>
              <span className="font-black text-emerald-400">
                +{formatAedCompact(activeInspectedUnit.projectedProfitAed)}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleOpenFullDetail(activeInspectedUnit)}
            className="w-full mt-2 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm pressable"
          >
            <span>Open Unit Ledger & Installments</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === '3d' && (
        <Tower3DCanvas
          units={units}
          selectedUnit={activeInspectedUnit}
          onSelectUnit={handleUnitPick}
          statusFilter={statusFilter}
        />
      )}

      {viewMode === '2d' && (
        <Tower2DFacade
          units={units}
          selectedUnit={activeInspectedUnit}
          onSelectUnit={handleUnitPick}
          statusFilter={statusFilter}
        />
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-2 gap-2.5">
          {units
            .filter(u => {
              if (statusFilter === 'Sold') return u.status === 'Sold' || u.status === 'HandedOver';
              if (statusFilter === 'Partial') return u.status === 'Reserved';
              if (statusFilter === 'Vacant') return u.status === 'Available';
              return true;
            })
            .map(unit => {
              const paidPercent = Math.round((unit.totalCollectedAed / unit.priceAed) * 100);

              return (
                <button
                  key={unit.id}
                  onClick={() => onSelectUnit(unit)}
                  className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-card text-left pressable hover:border-emerald-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                        {unit.unitNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          unit.status === 'Sold' || unit.status === 'HandedOver'
                            ? 'bg-emerald-100 text-emerald-800'
                            : unit.status === 'Reserved'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {unit.status === 'Reserved' ? 'Partial' : unit.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between font-medium">
                      <span>{unit.type}</span>
                      <span>{unit.areaSqft} sqft</span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold">Sale:</span>
                      <span className="text-sm font-black text-slate-900">
                        {formatAedCompact(unit.priceAed)}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-slate-500">
                      <span className="text-[10px] text-slate-400 font-semibold">Build Cost:</span>
                      <span className="text-xs font-bold text-slate-600">
                        -{formatAedCompact(unit.allocatedCostAed)}
                      </span>
                    </div>

                    <div className="mt-1.5 py-1 px-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-emerald-800">Profit:</span>
                      <span className="text-[11px] font-black text-emerald-700">
                        +{formatAedCompact(unit.projectedProfitAed)} ({unit.profitMarginPercent}%)
                      </span>
                    </div>

                    {unit.buyerName && (
                      <div className="text-[10px] text-slate-500 font-medium truncate mt-1 flex items-center gap-1">
                        <UserCheck className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{unit.buyerName}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400 mb-1">
                      <span>Collected</span>
                      <span className="text-slate-700 font-bold">{paidPercent}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          unit.status === 'Sold'
                            ? 'bg-emerald-500'
                            : unit.status === 'Reserved'
                            ? 'bg-amber-500'
                            : 'bg-slate-200'
                        }`}
                        style={{ width: `${paidPercent}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};
