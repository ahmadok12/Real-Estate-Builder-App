import {
  TowerProject,
  TowerUnit,
  ConstructionMilestone,
  ContractorIpc,
  PostDatedCheque,
  FinancialTransaction,
  ConstructionBudgetCategory,
  ConstructionExpense
} from '../types/accounting';

export const INITIAL_PROJECT: TowerProject = {
  id: 'tower-01',
  name: 'Burj Al Noor',
  location: 'Business Bay, Dubai, UAE',
  floorsCount: 32,
  totalUnits: 128,
  totalBuiltAreaSqft: 245000,
  gdvAed: 284500000, // Total Sales GDV Target: AED 284.5M
  totalCostBudgetAed: 152000000, // Total Construction Cost Budget: AED 152.0M
  escrowBank: 'Emirates NBD',
  escrowAccountNumber: '0214-998231-01',
  reraProjectId: 'RERA-DXB-8841',
  contractorName: 'Al Naboodah Construction LLC',
  consultantEngineer: 'Atkins Global Engineering',
  overallConstructionPercent: 62,
  salesProgressPercent: 78,
  escrowBalanceAed: 52400000,
  operatingBalanceAed: 18200000,
  retentionFundAed: 5710000,
  targetHandoverDate: 'Q4 2027',
};

export const INITIAL_BUDGET_CATEGORIES: ConstructionBudgetCategory[] = [
  {
    id: 'cat-1',
    category: 'Structure & Civil',
    budgetAed: 58000000,
    actualSpentAed: 51200000,
    committedAed: 56000000,
  },
  {
    id: 'cat-2',
    category: 'MEP Services',
    budgetAed: 34000000,
    actualSpentAed: 18700000,
    committedAed: 31000000,
  },
  {
    id: 'cat-3',
    category: 'Façade & Glazing',
    budgetAed: 26000000,
    actualSpentAed: 11500000,
    committedAed: 24000000,
  },
  {
    id: 'cat-4',
    category: 'Finishes & Fitout',
    budgetAed: 22000000,
    actualSpentAed: 4400000,
    committedAed: 16000000,
  },
  {
    id: 'cat-5',
    category: 'Consultants & Permits',
    budgetAed: 8000000,
    actualSpentAed: 6800000,
    committedAed: 7600000,
  },
  {
    id: 'cat-6',
    category: 'Contingency',
    budgetAed: 4000000,
    actualSpentAed: 1200000,
    committedAed: 2000000,
  },
];

export const INITIAL_EXPENSES: ConstructionExpense[] = [
  {
    id: 'exp-01',
    invoiceNumber: 'INV-CEM-901',
    vendorName: 'Dubai ReadyMix Concrete LLC',
    category: 'Structure & Civil',
    amountAed: 1450000,
    date: '2026-09-15',
    status: 'Paid',
    description: 'C40/50 High-Strength Concrete for L20 Slab Casting',
  },
  {
    id: 'exp-02',
    invoiceNumber: 'INV-STL-442',
    vendorName: 'Emirates Steel Industries',
    category: 'Structure & Civil',
    amountAed: 2100000,
    date: '2026-09-10',
    status: 'Paid',
    description: 'High-Tensile Deformed Rebar Reinforcement Batches',
  },
  {
    id: 'exp-03',
    invoiceNumber: 'INV-MEP-310',
    vendorName: 'Voltas Engineering Middle East',
    category: 'MEP Services',
    amountAed: 980000,
    date: '2026-09-05',
    status: 'Paid',
    description: 'Chilled Water Piping and Primary Risers Installation',
  },
  {
    id: 'exp-04',
    invoiceNumber: 'INV-GLZ-812',
    vendorName: 'Alumco Facade Systems',
    category: 'Façade & Glazing',
    amountAed: 1650000,
    date: '2026-08-28',
    status: 'Approved',
    description: 'Double Glazed Curtain Wall Units for L12 - L16',
  },
];

export const INITIAL_MILESTONES: ConstructionMilestone[] = [
  {
    id: 'm-1',
    phaseOrder: 1,
    title: 'Shoring & Piling Foundation',
    code: 'FND-01',
    targetPercent: 100,
    actualPercent: 100,
    targetDate: 'Jan 2025',
    status: 'Completed',
    budgetAed: 22000000,
    certifiedSpentAed: 22000000,
    engineerSignOff: true,
  },
  {
    id: 'm-2',
    phaseOrder: 2,
    title: 'Podium & Parking (P1 - P4)',
    code: 'POD-02',
    targetPercent: 100,
    actualPercent: 100,
    targetDate: 'Jun 2025',
    status: 'Completed',
    budgetAed: 28000000,
    certifiedSpentAed: 28000000,
    engineerSignOff: true,
  },
  {
    id: 'm-3',
    phaseOrder: 3,
    title: 'Superstructure Slab Castings (L1 - L20)',
    code: 'STR-03',
    targetPercent: 100,
    actualPercent: 88,
    targetDate: 'Dec 2025',
    status: 'In Progress',
    budgetAed: 54000000,
    certifiedSpentAed: 47520000,
    engineerSignOff: true,
  },
  {
    id: 'm-4',
    phaseOrder: 4,
    title: 'MEP Infrastructure & HVAC Risers',
    code: 'MEP-04',
    targetPercent: 60,
    actualPercent: 48,
    targetDate: 'May 2026',
    status: 'In Progress',
    budgetAed: 32000000,
    certifiedSpentAed: 15360000,
    engineerSignOff: false,
  },
  {
    id: 'm-5',
    phaseOrder: 5,
    title: 'Façade Glazing & Aluminium Cladding',
    code: 'FAC-05',
    targetPercent: 50,
    actualPercent: 35,
    targetDate: 'Oct 2026',
    status: 'In Progress',
    budgetAed: 26000000,
    certifiedSpentAed: 9100000,
    engineerSignOff: false,
  },
  {
    id: 'm-6',
    phaseOrder: 6,
    title: 'Internal Finishes & Marble Flooring',
    code: 'INT-06',
    targetPercent: 30,
    actualPercent: 10,
    targetDate: 'Mar 2027',
    status: 'Upcoming',
    budgetAed: 38000000,
    certifiedSpentAed: 3800000,
    engineerSignOff: false,
  },
  {
    id: 'm-7',
    phaseOrder: 7,
    title: 'Civil Defense, Snagging & RERA Handover',
    code: 'HND-07',
    targetPercent: 0,
    actualPercent: 0,
    targetDate: 'Nov 2027',
    status: 'Upcoming',
    budgetAed: 12000000,
    certifiedSpentAed: 0,
    engineerSignOff: false,
  }
];

export const INITIAL_IPCS: ContractorIpc[] = [
  {
    id: 'ipc-01',
    ipcNumber: 'IPC #01',
    period: 'Q1 2025',
    contractorName: 'Al Naboodah Construction',
    claimGrossAed: 22000000,
    certifiedGrossAed: 22000000,
    certifiedProgressPercent: 100,
    retentionPercent: 10,
    retentionDeductionAed: 2200000,
    vatPercent: 5,
    vatAmountAed: 990000,
    netPayableAed: 20790000,
    status: 'Paid',
    dateSubmitted: '2025-02-15',
    datePaid: '2025-02-28',
    engineerCertificateRef: 'ATKINS-CERT-01',
  },
  {
    id: 'ipc-02',
    ipcNumber: 'IPC #02',
    period: 'Q2 2025',
    contractorName: 'Al Naboodah Construction',
    claimGrossAed: 28000000,
    certifiedGrossAed: 28000000,
    certifiedProgressPercent: 100,
    retentionPercent: 10,
    retentionDeductionAed: 2800000,
    vatPercent: 5,
    vatAmountAed: 1260000,
    netPayableAed: 26460000,
    status: 'Paid',
    dateSubmitted: '2025-06-18',
    datePaid: '2025-07-02',
    engineerCertificateRef: 'ATKINS-CERT-02',
  },
  {
    id: 'ipc-03',
    ipcNumber: 'IPC #03',
    period: 'Q4 2025',
    contractorName: 'Al Naboodah Construction',
    claimGrossAed: 26500000,
    certifiedGrossAed: 25000000,
    certifiedProgressPercent: 94,
    retentionPercent: 10,
    retentionDeductionAed: 2500000,
    vatPercent: 5,
    vatAmountAed: 1125000,
    netPayableAed: 23625000,
    status: 'Certified',
    dateSubmitted: '2025-11-20',
    engineerCertificateRef: 'ATKINS-CERT-03-A',
  },
  {
    id: 'ipc-04',
    ipcNumber: 'IPC #04',
    period: 'Current / In-Review',
    contractorName: 'Al Naboodah Construction',
    claimGrossAed: 18500000,
    certifiedGrossAed: 17200000,
    certifiedProgressPercent: 92,
    retentionPercent: 10,
    retentionDeductionAed: 1720000,
    vatPercent: 5,
    vatAmountAed: 774000,
    netPayableAed: 16254000,
    status: 'Draft',
    dateSubmitted: '2026-02-10',
    engineerCertificateRef: 'PENDING-VERIFICATION',
  }
];

export const INITIAL_PDCS: PostDatedCheque[] = [
  {
    id: 'pdc-101',
    chequeNumber: 'CHQ-89021',
    bankName: 'First Abu Dhabi Bank (FAB)',
    drawerName: 'Rashid Al Maktoum',
    unitNumber: 'PH-3201',
    amountAed: 850000,
    dueDate: '2026-10-05',
    status: 'In Hand',
  },
  {
    id: 'pdc-102',
    chequeNumber: 'CHQ-44512',
    bankName: 'Mashreq Bank',
    drawerName: 'Elena Rostova',
    unitNumber: 'L24-02',
    amountAed: 280000,
    dueDate: '2026-10-18',
    status: 'Deposited',
    depositDate: '2026-09-18',
  },
  {
    id: 'pdc-103',
    chequeNumber: 'CHQ-77890',
    bankName: 'Emirates NBD',
    drawerName: 'Tariq Mansoor',
    unitNumber: 'L18-01',
    amountAed: 230000,
    dueDate: '2026-11-01',
    status: 'In Hand',
  },
  {
    id: 'pdc-104',
    chequeNumber: 'CHQ-12908',
    bankName: 'Dubai Islamic Bank (DIB)',
    drawerName: 'Kareem & Sarah Haddad',
    unitNumber: 'L14-04',
    amountAed: 175000,
    dueDate: '2026-09-15',
    status: 'Cleared',
    depositDate: '2026-09-12',
  },
  {
    id: 'pdc-105',
    chequeNumber: 'CHQ-66321',
    bankName: 'Abu Dhabi Commercial Bank (ADCB)',
    drawerName: 'Alexander Hayes',
    unitNumber: 'L12-03',
    amountAed: 145000,
    dueDate: '2026-11-20',
    status: 'In Hand',
  }
];

// Helper to generate realistic 32 floors of units with allocated construction cost and profit
export function generateSeedUnits(): TowerUnit[] {
  const units: TowerUnit[] = [];
  const floors = [
    { floor: 32, type: 'Penthouse' as const, cat: 'Penthouse' as const, count: 2, price: 8500000, area: 4200, costRate: 750 },
    { floor: 31, type: 'Penthouse' as const, cat: 'Penthouse' as const, count: 2, price: 8200000, area: 4000, costRate: 750 },
    { floor: 28, type: '3BR' as const, cat: 'Residential' as const, count: 4, price: 3800000, area: 2100, costRate: 640 },
    { floor: 24, type: '2BR' as const, cat: 'Residential' as const, count: 4, price: 2400000, area: 1350, costRate: 620 },
    { floor: 20, type: '2BR' as const, cat: 'Residential' as const, count: 4, price: 2300000, area: 1300, costRate: 620 },
    { floor: 18, type: '2BR' as const, cat: 'Residential' as const, count: 4, price: 2250000, area: 1280, costRate: 620 },
    { floor: 15, type: '1BR' as const, cat: 'Residential' as const, count: 4, price: 1650000, area: 890, costRate: 600 },
    { floor: 14, type: '1BR' as const, cat: 'Residential' as const, count: 4, price: 1600000, area: 870, costRate: 600 },
    { floor: 12, type: '1BR' as const, cat: 'Residential' as const, count: 4, price: 1550000, area: 850, costRate: 600 },
    { floor: 10, type: '1BR' as const, cat: 'Residential' as const, count: 4, price: 1500000, area: 840, costRate: 600 },
    { floor: 8, type: 'Studio' as const, cat: 'Residential' as const, count: 4, price: 920000, area: 540, costRate: 580 },
    { floor: 6, type: 'Studio' as const, cat: 'Residential' as const, count: 4, price: 890000, area: 520, costRate: 580 },
    { floor: 4, type: 'Studio' as const, cat: 'Residential' as const, count: 4, price: 870000, area: 510, costRate: 580 },
    { floor: 2, type: 'Retail' as const, cat: 'Retail' as const, count: 2, price: 4500000, area: 2800, costRate: 550 },
    { floor: 1, type: 'Retail' as const, cat: 'Retail' as const, count: 2, price: 5200000, area: 3200, costRate: 550 },
  ];

  const buyers = [
    { name: 'Rashid Al Maktoum', nat: 'UAE', phone: '+971 50 123 4567' },
    { name: 'Elena Rostova', nat: 'Monaco', phone: '+377 98 76 54 32' },
    { name: 'Tariq Mansoor', nat: 'Saudi Arabia', phone: '+966 55 432 1987' },
    { name: 'Kareem & Sarah Haddad', nat: 'Lebanon', phone: '+971 52 888 1234' },
    { name: 'Alexander Hayes', nat: 'United Kingdom', phone: '+44 7700 900123' },
    { name: 'Vikram & Priya Mehta', nat: 'India', phone: '+971 55 999 4433' },
    { name: 'Fatima Al Qasimi', nat: 'UAE', phone: '+971 50 777 9900' },
    { name: 'Marcus Lindstrom', nat: 'Sweden', phone: '+46 70 123 4567' },
    { name: 'Sultan Bin Zayed', nat: 'UAE', phone: '+971 50 333 2211' },
    { name: 'Li Wei Investment Ltd', nat: 'Singapore', phone: '+65 6789 0123' },
  ];

  let buyerIdx = 0;

  floors.forEach((f) => {
    for (let u = 1; u <= f.count; u++) {
      const unitCode = f.cat === 'Penthouse' ? `PH-${f.floor}0${u}` : `L${f.floor < 10 ? '0' + f.floor : f.floor}-0${u}`;
      const dld = Math.round(f.price * 0.04);
      const oqood = 2000;

      // Construction cost allocated to this unit: Area * Cost Rate per sqft
      const allocatedCost = Math.round(f.area * f.costRate);
      const profit = f.price - allocatedCost;
      const margin = Math.round((profit / f.price) * 100);

      // Status distribution
      let status: 'Available' | 'Reserved' | 'Sold' | 'HandedOver' = 'Available';
      let totalCollected = 0;
      let buyer: { name: string; nat: string; phone: string } | undefined = undefined;

      const hash = (f.floor * 17 + u * 13) % 10;
      if (hash < 6) {
        status = 'Sold';
        buyer = buyers[buyerIdx % buyers.length];
        buyerIdx++;
        totalCollected = Math.round(f.price * 0.5); // 50% paid
      } else if (hash < 8) {
        status = 'Reserved';
        buyer = buyers[buyerIdx % buyers.length];
        buyerIdx++;
        totalCollected = Math.round(f.price * 0.1); // 10% token
      } else {
        status = 'Available';
      }

      const plan: TowerUnit['paymentPlan'] = [
        {
          id: `p-${unitCode}-1`,
          milestoneTitle: '10% Booking Deposit',
          percentage: 10,
          amountAed: Math.round(f.price * 0.1),
          dueDate: '2025-01-15',
          status: status === 'Sold' || status === 'Reserved' ? 'Paid' : 'Pending',
          paidDate: status === 'Sold' || status === 'Reserved' ? '2025-01-14' : undefined,
          receiptNumber: 'REC-DXB-9011'
        },
        {
          id: `p-${unitCode}-2`,
          milestoneTitle: '10% at Raft / Ground Slab',
          percentage: 10,
          amountAed: Math.round(f.price * 0.1),
          dueDate: '2025-06-20',
          status: status === 'Sold' ? 'Paid' : (status === 'Reserved' ? 'Invoiced' : 'Pending'),
          paidDate: status === 'Sold' ? '2025-06-18' : undefined,
          receiptNumber: 'REC-DXB-9442'
        },
        {
          id: `p-${unitCode}-3`,
          milestoneTitle: '20% at 40% Superstructure',
          percentage: 20,
          amountAed: Math.round(f.price * 0.2),
          dueDate: '2025-11-30',
          status: status === 'Sold' ? 'Paid' : 'Pending',
          paidDate: status === 'Sold' ? '2025-11-28' : undefined,
          receiptNumber: 'REC-DXB-9810'
        },
        {
          id: `p-${unitCode}-4`,
          milestoneTitle: '10% at 70% Façade Glazing',
          percentage: 10,
          amountAed: Math.round(f.price * 0.1),
          dueDate: '2026-10-15',
          status: status === 'Sold' ? (hash === 1 ? 'Paid' : 'Invoiced') : 'Pending',
          paidDate: status === 'Sold' && hash === 1 ? '2026-09-01' : undefined
        },
        {
          id: `p-${unitCode}-5`,
          milestoneTitle: '50% on Completion & Handover',
          percentage: 50,
          amountAed: Math.round(f.price * 0.5),
          dueDate: '2027-11-30',
          status: 'Pending'
        }
      ];

      units.push({
        id: `u-${unitCode}`,
        unitNumber: unitCode,
        floor: f.floor,
        floorCategory: f.cat,
        type: f.type,
        areaSqft: f.area,
        priceAed: f.price,
        allocatedCostAed: allocatedCost,
        projectedProfitAed: profit,
        profitMarginPercent: margin,
        dldFeeAed: dld,
        oqoodFeeAed: oqood,
        status,
        buyerName: buyer?.name,
        buyerPhone: buyer?.phone,
        buyerNationality: buyer?.nat,
        totalCollectedAed: totalCollected,
        paymentPlan: plan,
      });
    }
  });

  return units;
}

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-001',
    timestamp: '2026-09-18 14:22',
    type: 'INFLOW_SALES',
    title: 'Unit L24-02 Milestone Collection (Elena Rostova)',
    amountAed: 240000,
    reference: 'ESC-DEP-9941',
    escrowAccount: true,
  },
  {
    id: 'tx-002',
    timestamp: '2026-09-15 10:30',
    type: 'OUTFLOW_COST',
    title: 'ReadyMix Concrete Batch - L20 Slab (INV-CEM-901)',
    amountAed: 1450000,
    reference: 'PO-CONC-8812',
    escrowAccount: true,
  },
  {
    id: 'tx-003',
    timestamp: '2026-09-12 11:05',
    type: 'INFLOW_SALES',
    title: 'Unit L14-04 PDC Cleared (Kareem Haddad)',
    amountAed: 175000,
    reference: 'CHQ-12908',
    escrowAccount: true,
  },
  {
    id: 'tx-004',
    timestamp: '2026-07-02 09:40',
    type: 'OUTFLOW_IPC',
    title: 'Contractor IPC #02 Escrow Disbursement',
    amountAed: 26460000,
    reference: 'RERA-DISB-002',
    escrowAccount: true,
  },
  {
    id: 'tx-005',
    timestamp: '2026-07-02 09:40',
    type: 'OUTFLOW_RETENTION',
    title: '10% Contractor Retention Escrow Holdback',
    amountAed: 2800000,
    reference: 'RET-HOLD-02',
    escrowAccount: true,
  }
];
