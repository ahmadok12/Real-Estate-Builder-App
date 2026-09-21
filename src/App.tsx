import React, { useState } from 'react';
import { AccountingProvider } from './context/AccountingContext';
import { MobileShell, TabType } from './components/layout/MobileShell';
import { PulseView } from './components/dashboard/PulseView';
import { TowerElevationView } from './components/tower/TowerElevationView';
import { CapexView } from './components/construction/CapexView';
import { PdcFinanceView } from './components/finance/PdcFinanceView';
import { UnitDetailSheet } from './components/modals/UnitDetailSheet';
import { NewIpcModal } from './components/modals/NewIpcModal';
import { NewCostModal } from './components/modals/NewCostModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import type { TowerUnit } from './types/accounting';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('pulse');
  const [selectedUnit, setSelectedUnit] = useState<TowerUnit | null>(null);
  const [isIpcModalOpen, setIsIpcModalOpen] = useState(false);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <MobileShell
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onOpenQuickAdd={() => setIsQuickAddOpen(true)}
    >
      <PwaInstallBanner />

      {currentTab === 'pulse' && (
        <PulseView
          onNavigateTab={setCurrentTab}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        />
      )}

      {currentTab === 'tower' && (
        <TowerElevationView onSelectUnit={unit => setSelectedUnit(unit)} />
      )}

      {currentTab === 'build' && (
        <CapexView
          onOpenNewIpc={() => setIsIpcModalOpen(true)}
          onOpenNewCost={() => setIsCostModalOpen(true)}
        />
      )}

      {currentTab === 'finance' && <PdcFinanceView />}

      {/* Sheets & Modals */}
      <UnitDetailSheet
        unit={selectedUnit}
        onClose={() => setSelectedUnit(null)}
      />

      <NewIpcModal
        isOpen={isIpcModalOpen}
        onClose={() => setIsIpcModalOpen(false)}
      />

      <NewCostModal
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onOpenIpcModal={() => setIsIpcModalOpen(true)}
        onOpenCostModal={() => setIsCostModalOpen(true)}
      />
    </MobileShell>
  );
}

export default function App() {
  return (
    <AccountingProvider>
      <AppContent />
    </AccountingProvider>
  );
}
