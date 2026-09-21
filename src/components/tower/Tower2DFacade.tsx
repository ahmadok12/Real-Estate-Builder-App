import React from 'react';
import type { TowerUnit } from '../../types/accounting';
import { formatAedCompact } from '../../utils/formatters';
import { Check, Clock, Eye } from 'lucide-react';

interface Tower2DFacadeProps {
  units: TowerUnit[];
  selectedUnit: TowerUnit | null;
  onSelectUnit: (unit: TowerUnit) => void;
  statusFilter: 'All' | 'Sold' | 'Partial' | 'Vacant';
}

export const Tower2DFacade: React.FC<Tower2DFacadeProps> = ({
  units,
  selectedUnit,
  onSelectUnit,
  statusFilter,
}) => {
  // Group units by floor and sort descending (Penthouse 32 at top, Ground at bottom)
  const floorsMap = new Map<number, TowerUnit[]>();
  units.forEach(u => {
    const arr = floorsMap.get(u.floor) || [];
    arr.push(u);
    floorsMap.set(u.floor, arr);
  });

  const sortedFloors = Array.from(floorsMap.keys()).sort((a, b) => b - a);

  return (
    <div className="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-card space-y-3">
      {/* Tower Top Spire Illustration */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1">
        <div className="w-1.5 h-7 bg-amber-500 rounded-t-full shadow-xs" />
        <div className="w-16 h-3 bg-slate-900 rounded-t-md flex items-center justify-center text-[8px] font-black text-amber-400">
          HELIPAD
        </div>
      </div>

      {/* Floor-by-floor Facade Grid */}
      <div className="space-y-1 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
        {sortedFloors.map(floorNum => {
          const floorUnits = floorsMap.get(floorNum) || [];
          const isPenthouse = floorNum >= 31;
          const isPodium = floorNum <= 2;

          return (
            <div key={floorNum} className="flex items-center gap-1.5">
              {/* Floor Badge */}
              <div
                className={`w-9 h-7 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-extrabold ${
                  isPenthouse
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : isPodium
                    ? 'bg-slate-900 text-slate-100'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isPenthouse ? `PH${floorNum}` : isPodium ? `P${floorNum}` : `L${floorNum}`}
              </div>

              {/* Units on this floor */}
              <div className="flex-1 grid grid-flow-col auto-cols-fr gap-1 h-7">
                {floorUnits.map(unit => {
                  const isSold = unit.status === 'Sold' || unit.status === 'HandedOver';
                  const isPartial = unit.status === 'Reserved';
                  const isVacant = unit.status === 'Available';
                  const isSelected = selectedUnit?.id === unit.id;

                  // Filter visibility
                  let isDimmed = false;
                  if (statusFilter === 'Sold' && !isSold) isDimmed = true;
                  if (statusFilter === 'Partial' && !isPartial) isDimmed = true;
                  if (statusFilter === 'Vacant' && !isVacant) isDimmed = true;

                  const paidPercent = Math.round((unit.totalCollectedAed / unit.priceAed) * 100);

                  return (
                    <button
                      key={unit.id}
                      onClick={() => onSelectUnit(unit)}
                      className={`relative rounded-lg px-1 text-left flex items-center justify-between transition-all pressable ${
                        isSelected
                          ? 'ring-2 ring-slate-900 ring-offset-1 z-10'
                          : ''
                      } ${
                        isDimmed ? 'opacity-20' : 'opacity-100'
                      } ${
                        isSold
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isPartial
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 border border-slate-300/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span className="text-[10px] font-extrabold truncate">
                          {unit.unitNumber.replace('PH-', '').replace('L', '')}
                        </span>
                      </div>

                      <div className="text-[9px] font-black shrink-0">
                        {isSold ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : isPartial ? (
                          <span>{paidPercent}%</span>
                        ) : (
                          <span className="text-[8px] font-bold text-slate-400">OPEN</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ground Foundation */}
      <div className="w-full h-3 bg-slate-900 rounded-b-xl flex items-center justify-center text-[8px] font-extrabold text-slate-400 tracking-widest uppercase">
        Ground & Underground Piling
      </div>
    </div>
  );
};
