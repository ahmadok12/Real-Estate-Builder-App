import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  TowerProject,
  TowerUnit,
  ConstructionMilestone,
  ContractorIpc,
  PostDatedCheque,
  FinancialTransaction,
  ConstructionBudgetCategory,
  ConstructionExpense,
  UnitStatus
} from '../types/accounting';
import {
  INITIAL_PROJECT,
  INITIAL_BUDGET_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_MILESTONES,
  INITIAL_IPCS,
  INITIAL_PDCS,
  INITIAL_TRANSACTIONS,
  generateSeedUnits
} from '../data/seedData';

interface AccountingContextType {
  project: TowerProject;
  units: TowerUnit[];
  budgetCategories: ConstructionBudgetCategory[];
  constructionExpenses: ConstructionExpense[];
  milestones: ConstructionMilestone[];
  ipcs: ContractorIpc[];
  pdcs: PostDatedCheque[];
  transactions: FinancialTransaction[];
  stats: {
    // Sales side
    totalUnits: number;
    soldUnits: number;
    reservedUnits: number;
    availableUnits: number;
    salesGdvAed: number;
    salesSoldVolumeAed: number;
    totalCollectedAed: number;
    totalReceivablesAed: number;

    // Cost side
    totalCostBudgetAed: number;
    totalCostSpentAed: number;
    costRemainingAed: number;
    costBurnPercent: number;
    avgCostPerSqftAed: number;

    // Builder Profit & Cash Matching
    projectedProfitAed: number;
    projectedMarginPercent: number;
    realizedSoldProfitAed: number;
    cashCoverageSurplusAed: number;
    isCashFlowPositive: boolean;

    // Retentions & Taxes
    retentionLockedAed: number;
    pendingIpcClaimsAed: number;
    maturedPdcAed: number;
    upcomingPdcAed: number;
    inputVatAed: number;
  };
  addConstructionExpense: (expense: Omit<ConstructionExpense, 'id' | 'status'>) => void;
  updateUnitStatus: (unitId: string, status: UnitStatus, buyerName?: string, phone?: string) => void;
  markInstallmentPaid: (unitId: string, installmentId: string) => void;
  approveIpc: (ipcId: string) => void;
  addNewIpc: (ipc: Omit<ContractorIpc, 'id' | 'netPayableAed' | 'retentionDeductionAed' | 'vatAmountAed' | 'status'>) => void;
  updatePdcStatus: (pdcId: string, status: PostDatedCheque['status']) => void;
  addPdc: (pdc: Omit<PostDatedCheque, 'id'>) => void;
  updateMilestoneProgress: (milestoneId: string, percent: number) => void;
  resetToDemoData: () => void;
  exportAuditData: () => void;
}

const STORAGE_KEY = 'burj_accounts_state_v3';

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<TowerProject>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_project`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_PROJECT, ...parsed };
      }
    } catch {
      // fallback
    }
    return INITIAL_PROJECT;
  });

  const [budgetCategories, setBudgetCategories] = useState<ConstructionBudgetCategory[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_BUDGET_CATEGORIES;
  });

  const [constructionExpenses, setConstructionExpenses] = useState<ConstructionExpense[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_EXPENSES;
  });

  const [units, setUnits] = useState<TowerUnit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_units`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all units have allocatedCostAed and projectedProfitAed
          return parsed.map((u: any) => {
            const costRate = u.floor >= 31 ? 750 : u.floor >= 20 ? 620 : 600;
            const allocatedCost = u.allocatedCostAed || Math.round((u.areaSqft || 800) * costRate);
            const price = u.priceAed || 1500000;
            const profit = u.projectedProfitAed !== undefined ? u.projectedProfitAed : (price - allocatedCost);
            const margin = u.profitMarginPercent !== undefined ? u.profitMarginPercent : Math.round((profit / price) * 100);
            return {
              ...u,
              allocatedCostAed: allocatedCost,
              projectedProfitAed: profit,
              profitMarginPercent: margin,
              paymentPlan: Array.isArray(u.paymentPlan) ? u.paymentPlan : [],
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return generateSeedUnits();
  });

  const [milestones, setMilestones] = useState<ConstructionMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_milestones`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MILESTONES;
  });

  const [ipcs, setIpcs] = useState<ContractorIpc[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ipcs`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_IPCS;
  });

  const [pdcs, setPdcs] = useState<PostDatedCheque[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pdcs`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PDCS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_project`, JSON.stringify(project));
      localStorage.setItem(`${STORAGE_KEY}_budget`, JSON.stringify(budgetCategories));
      localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(constructionExpenses));
      localStorage.setItem(`${STORAGE_KEY}_units`, JSON.stringify(units));
      localStorage.setItem(`${STORAGE_KEY}_milestones`, JSON.stringify(milestones));
      localStorage.setItem(`${STORAGE_KEY}_ipcs`, JSON.stringify(ipcs));
      localStorage.setItem(`${STORAGE_KEY}_pdcs`, JSON.stringify(pdcs));
      localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    } catch {
      // quota or private mode fallback
    }
  }, [project, budgetCategories, constructionExpenses, units, milestones, ipcs, pdcs, transactions]);

  // Safely compute Accounting KPIs
  const stats = useMemo(() => {
    const safeUnits = Array.isArray(units) ? units : [];
    const safeBudgets = Array.isArray(budgetCategories) ? budgetCategories : [];
    const safeIpcs = Array.isArray(ipcs) ? ipcs : [];
    const safePdcs = Array.isArray(pdcs) ? pdcs : [];

    // 1. Sales Side
    const soldUnits = safeUnits.filter(u => u.status === 'Sold' || u.status === 'HandedOver').length;
    const reservedUnits = safeUnits.filter(u => u.status === 'Reserved').length;
    const availableUnits = safeUnits.filter(u => u.status === 'Available').length;

    const salesGdvAed = project?.gdvAed || 284500000;
    const salesSoldVolumeAed = safeUnits
      .filter(u => u.status === 'Sold' || u.status === 'HandedOver' || u.status === 'Reserved')
      .reduce((sum, u) => sum + (u.priceAed || 0), 0);

    const totalCollectedAed = safeUnits.reduce((sum, u) => sum + (u.totalCollectedAed || 0), 0);
    const totalReceivablesAed = Math.max(0, salesSoldVolumeAed - totalCollectedAed);

    // 2. Cost Side
    const totalCostBudgetAed = safeBudgets.reduce((sum, b) => sum + (b.budgetAed || 0), 0) || 152000000;
    const totalCostSpentAed = safeBudgets.reduce((sum, b) => sum + (b.actualSpentAed || 0), 0);
    const costRemainingAed = Math.max(0, totalCostBudgetAed - totalCostSpentAed);
    const costBurnPercent = totalCostBudgetAed > 0 ? Math.round((totalCostSpentAed / totalCostBudgetAed) * 100) : 0;
    const builtArea = project?.totalBuiltAreaSqft || 245000;
    const avgCostPerSqftAed = builtArea > 0 ? Math.round(totalCostBudgetAed / builtArea) : 620;

    // 3. Profit & Cashflow Matching
    const projectedProfitAed = salesGdvAed - totalCostBudgetAed;
    const projectedMarginPercent = salesGdvAed > 0 ? Math.round((projectedProfitAed / salesGdvAed) * 100) : 0;

    const realizedSoldProfitAed = safeUnits
      .filter(u => u.status === 'Sold' || u.status === 'HandedOver')
      .reduce((sum, u) => sum + (u.projectedProfitAed || 0), 0);

    const cashCoverageSurplusAed = totalCollectedAed - totalCostSpentAed;
    const isCashFlowPositive = cashCoverageSurplusAed >= 0;

    // Retentions & Taxes
    const paidIpcs = safeIpcs.filter(i => i.status === 'Paid');
    const retentionLockedAed = paidIpcs.reduce((sum, i) => sum + (i.retentionDeductionAed || 0), 0);
    const inputVatAed = paidIpcs.reduce((sum, i) => sum + (i.vatAmountAed || 0), 0);

    const pendingIpcClaimsAed = safeIpcs
      .filter(i => i.status !== 'Paid')
      .reduce((sum, i) => sum + (i.netPayableAed || 0), 0);

    const maturedPdcAed = safePdcs
      .filter(p => p.status === 'Cleared')
      .reduce((sum, p) => sum + (p.amountAed || 0), 0);

    const upcomingPdcAed = safePdcs
      .filter(p => p.status === 'In Hand' || p.status === 'Deposited')
      .reduce((sum, p) => sum + (p.amountAed || 0), 0);

    return {
      totalUnits: safeUnits.length,
      soldUnits,
      reservedUnits,
      availableUnits,
      salesGdvAed,
      salesSoldVolumeAed,
      totalCollectedAed,
      totalReceivablesAed,
      totalCostBudgetAed,
      totalCostSpentAed,
      costRemainingAed,
      costBurnPercent,
      avgCostPerSqftAed,
      projectedProfitAed,
      projectedMarginPercent,
      realizedSoldProfitAed,
      cashCoverageSurplusAed,
      isCashFlowPositive,
      retentionLockedAed,
      pendingIpcClaimsAed,
      maturedPdcAed,
      upcomingPdcAed,
      inputVatAed,
    };
  }, [units, budgetCategories, ipcs, pdcs, project]);

  // Actions
  const addConstructionExpense = (expenseData: Omit<ConstructionExpense, 'id' | 'status'>) => {
    const newExpense: ConstructionExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      status: 'Paid',
    };

    setConstructionExpenses(prev => [newExpense, ...prev]);

    setBudgetCategories(prev =>
      prev.map(cat => {
        if (cat.category === expenseData.category) {
          return {
            ...cat,
            actualSpentAed: cat.actualSpentAed + expenseData.amountAed,
          };
        }
        return cat;
      })
    );

    setProject(p => ({
      ...p,
      escrowBalanceAed: Math.max(0, p.escrowBalanceAed - expenseData.amountAed),
    }));

    const tx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'OUTFLOW_COST',
      title: `${expenseData.category}: ${expenseData.vendorName} (${expenseData.invoiceNumber})`,
      amountAed: expenseData.amountAed,
      reference: expenseData.invoiceNumber,
      escrowAccount: true,
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const updateUnitStatus = (unitId: string, status: UnitStatus, buyerName?: string, phone?: string) => {
    setUnits(prev =>
      prev.map(u => {
        if (u.id !== unitId) return u;
        return {
          ...u,
          status,
          buyerName: buyerName || u.buyerName || 'Private Investor',
          buyerPhone: phone || u.buyerPhone,
        };
      })
    );
  };

  const markInstallmentPaid = (unitId: string, installmentId: string) => {
    let collectedAmount = 0;
    let unitNum = '';
    let buyer = '';

    setUnits(prev =>
      prev.map(u => {
        if (u.id !== unitId) return u;
        unitNum = u.unitNumber;
        buyer = u.buyerName || 'Buyer';
        const updatedPlan = (u.paymentPlan || []).map(p => {
          if (p.id === installmentId && p.status !== 'Paid') {
            collectedAmount = p.amountAed;
            return {
              ...p,
              status: 'Paid' as const,
              paidDate: new Date().toISOString().split('T')[0],
              receiptNumber: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
            };
          }
          return p;
        });

        const newTotal = updatedPlan
          .filter(p => p.status === 'Paid')
          .reduce((sum, p) => sum + p.amountAed, 0);

        return {
          ...u,
          totalCollectedAed: newTotal,
          paymentPlan: updatedPlan,
          status: newTotal >= u.priceAed ? ('HandedOver' as const) : u.status,
        };
      })
    );

    if (collectedAmount > 0) {
      setProject(p => ({
        ...p,
        escrowBalanceAed: p.escrowBalanceAed + collectedAmount,
      }));

      const newTx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'INFLOW_SALES',
        title: `Unit ${unitNum} Installment (${buyer})`,
        amountAed: collectedAmount,
        reference: `ESC-DEP-${Math.floor(1000 + Math.random() * 9000)}`,
        escrowAccount: true,
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const approveIpc = (ipcId: string) => {
    let netToPay = 0;
    let retentionAmount = 0;
    let ipcNum = '';

    setIpcs(prev =>
      prev.map(item => {
        if (item.id !== ipcId) return item;
        ipcNum = item.ipcNumber;
        netToPay = item.netPayableAed;
        retentionAmount = item.retentionDeductionAed;
        return {
          ...item,
          status: 'Paid',
          datePaid: new Date().toISOString().split('T')[0],
        };
      })
    );

    if (netToPay > 0) {
      setProject(p => ({
        ...p,
        escrowBalanceAed: Math.max(0, p.escrowBalanceAed - netToPay),
        retentionFundAed: p.retentionFundAed + retentionAmount,
      }));

      const txDisb: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'OUTFLOW_IPC',
        title: `RERA Escrow Disbursement for ${ipcNum}`,
        amountAed: netToPay,
        reference: `RERA-DISB-${Math.floor(1000 + Math.random() * 9000)}`,
        escrowAccount: true,
      };

      const txRet: FinancialTransaction = {
        id: `tx-${Date.now() + 1}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'OUTFLOW_RETENTION',
        title: `10% Retention Holdback for ${ipcNum}`,
        amountAed: retentionAmount,
        reference: `RET-HOLD-${Math.floor(100 + Math.random() * 900)}`,
        escrowAccount: true,
      };

      setTransactions(prev => [txDisb, txRet, ...prev]);
    }
  };

  const addNewIpc = (data: Omit<ContractorIpc, 'id' | 'netPayableAed' | 'retentionDeductionAed' | 'vatAmountAed' | 'status'>) => {
    const retentionDeduction = Math.round(data.certifiedGrossAed * (data.retentionPercent / 100));
    const taxableAmount = data.certifiedGrossAed - retentionDeduction;
    const vatAmount = Math.round(taxableAmount * (data.vatPercent / 100));
    const netPayable = taxableAmount + vatAmount;

    const newIpc: ContractorIpc = {
      ...data,
      id: `ipc-${Date.now()}`,
      retentionDeductionAed: retentionDeduction,
      vatAmountAed: vatAmount,
      netPayableAed: netPayable,
      status: 'Certified',
      dateSubmitted: new Date().toISOString().split('T')[0],
      engineerCertificateRef: `ATKINS-CERT-0${ipcs.length + 1}`,
    };

    setIpcs(prev => [newIpc, ...prev]);
  };

  const updatePdcStatus = (pdcId: string, status: PostDatedCheque['status']) => {
    let pdcAmount = 0;
    let chqNum = '';
    let unitNum = '';

    setPdcs(prev =>
      prev.map(p => {
        if (p.id !== pdcId) return p;
        chqNum = p.chequeNumber;
        unitNum = p.unitNumber;
        if (status === 'Cleared' && p.status !== 'Cleared') {
          pdcAmount = p.amountAed;
        }
        return {
          ...p,
          status,
          depositDate: status === 'Deposited' || status === 'Cleared' ? new Date().toISOString().split('T')[0] : p.depositDate,
        };
      })
    );

    if (pdcAmount > 0) {
      setProject(p => ({
        ...p,
        escrowBalanceAed: p.escrowBalanceAed + pdcAmount,
      }));

      const tx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'INFLOW_SALES',
        title: `PDC Cleared ${chqNum} (Unit ${unitNum})`,
        amountAed: pdcAmount,
        reference: `CHQ-CLEAR-${Math.floor(1000 + Math.random() * 9000)}`,
        escrowAccount: true,
      };
      setTransactions(prev => [tx, ...prev]);
    }
  };

  const addPdc = (pdcData: Omit<PostDatedCheque, 'id'>) => {
    const newPdc: PostDatedCheque = {
      ...pdcData,
      id: `pdc-${Date.now()}`,
    };
    setPdcs(prev => [newPdc, ...prev]);
  };

  const updateMilestoneProgress = (milestoneId: string, percent: number) => {
    setMilestones(prev => {
      const updated = prev.map(m => {
        if (m.id !== milestoneId) return m;
        const clamped = Math.min(100, Math.max(0, percent));
        return {
          ...m,
          actualPercent: clamped,
          status: clamped >= 100 ? ('Completed' as const) : clamped > 0 ? ('In Progress' as const) : ('Upcoming' as const),
          engineerSignOff: clamped >= 100,
        };
      });

      const avg = Math.round(updated.reduce((sum, m) => sum + m.actualPercent, 0) / updated.length);
      setProject(p => ({ ...p, overallConstructionPercent: avg }));
      return updated;
    });
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setProject(INITIAL_PROJECT);
    setBudgetCategories(INITIAL_BUDGET_CATEGORIES);
    setConstructionExpenses(INITIAL_EXPENSES);
    setUnits(generateSeedUnits());
    setMilestones(INITIAL_MILESTONES);
    setIpcs(INITIAL_IPCS);
    setPdcs(INITIAL_PDCS);
    setTransactions(INITIAL_TRANSACTIONS);
  };

  const exportAuditData = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      reraRegistration: project.reraProjectId,
      escrowAccount: project.escrowAccountNumber,
      project,
      summaryStats: stats,
      budgetCategories,
      constructionExpenses,
      milestones,
      ipcs,
      pdcs,
      unitsSample: units.slice(0, 20),
      transactions,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BURJ-AL-NOOR-FINANCIAL-AUDIT-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AccountingContext.Provider
      value={{
        project,
        units,
        budgetCategories,
        constructionExpenses,
        milestones,
        ipcs,
        pdcs,
        transactions,
        stats,
        addConstructionExpense,
        updateUnitStatus,
        markInstallmentPaid,
        approveIpc,
        addNewIpc,
        updatePdcStatus,
        addPdc,
        updateMilestoneProgress,
        resetToDemoData,
        exportAuditData,
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};
