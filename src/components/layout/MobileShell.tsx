import React, { useState } from 'react';
import {
  Activity,
  Building2,
  HardHat,
  Landmark,
  Plus,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { Header } from './Header';

export type TabType = 'pulse' | 'tower' | 'build' | 'finance';

interface MobileShellProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickAdd: () => void;
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickAdd,
  children
}) => {
  const [isFramed, setIsFramed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-200/70 flex flex-col items-center justify-start md:py-6 sm:px-4 font-sans text-slate-900">
      {/* Frame Toggle for Desktop Viewers */}
      <aside aria-label="Simulator Controls" className="hidden md:flex items-center justify-between w-full max-w-[440px] mb-3 px-2 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          Burj Accounts Mobile PWA
        </span>
        <button
          onClick={() => setIsFramed(!isFramed)}
          className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg shadow-sm border border-slate-200 hover:text-slate-800 transition-colors"
        >
          {isFramed ? <Maximize2 className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
          <span>{isFramed ? 'Full Width' : 'Phone Frame'}</span>
        </button>
      </aside>

      {/* Main Mobile App Frame */}
      <main
        className={`w-full bg-white relative flex flex-col transition-all duration-200 ${
          isFramed
            ? 'max-w-[430px] min-h-[860px] md:h-[90vh] md:rounded-[44px] md:shadow-2xl md:border-[8px] md:border-slate-800/90 overflow-hidden'
            : 'max-w-xl min-h-screen shadow-lg'
        }`}
      >
        {/* iOS Dynamic Island / Speaker Notch on Desktop Frame */}
        {isFramed && (
          <div className="hidden md:flex justify-center pt-2 pb-1 bg-white z-40 relative">
            <div className="w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>
          </div>
        )}

        {/* Compact Header */}
        <Header onOpenQuickAdd={onOpenQuickAdd} />

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#FAF9F6]">
          {children}
        </div>

        {/* Floating Add Button */}
        <div className="absolute bottom-20 right-4 z-30">
          <button
            onClick={onOpenQuickAdd}
            className="w-13 h-13 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-float pressable p-3.5 hover:shadow-lg transition-all"
            title="Quick Action"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 pt-2 pb-5 flex items-center justify-around">
          <button
            onClick={() => onSelectTab('pulse')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all pressable ${
              currentTab === 'pulse'
                ? 'text-amber-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Activity className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] tracking-tight">Pulse</span>
          </button>

          <button
            onClick={() => onSelectTab('tower')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all pressable ${
              currentTab === 'tower'
                ? 'text-amber-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Building2 className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] tracking-tight">Tower</span>
          </button>

          <button
            onClick={() => onSelectTab('build')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all pressable ${
              currentTab === 'build'
                ? 'text-amber-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <HardHat className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] tracking-tight">Build</span>
          </button>

          <button
            onClick={() => onSelectTab('finance')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all pressable ${
              currentTab === 'finance'
                ? 'text-amber-600 font-bold'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Landmark className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] tracking-tight">Finance</span>
          </button>
        </nav>
      </main>
    </div>
  );
};
