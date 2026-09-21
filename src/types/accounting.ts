export type UnitStatus = 'Available' | 'Reserved' | 'Sold' | 'HandedOver';

export type UnitType = 'Studio' | '1BR' | '2BR' | '3BR' | 'Penthouse' | 'Retail';

export type FloorCategory = 'Podium' | 'Residential' | 'Penthouse' | 'Retail';

export type CostCategory =
  | 'Structure & Civil'
  | 'MEP Services'
  | 'Façade & Glazing'
  | 'Finishes & Fitout'
  | 'Consultants & Permits'
  | 'Contingency';

export interface ConstructionBudgetCategory {
  id: string;
  category: CostCategory;
  budgetAed: number;
  actualSpentAed: number;
  committedAed: number;
}

export interface ConstructionExpense {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  category: CostCategory;
  amountAed: number;
  date: string;
  status: 'Paid' | 'Approved' | 'Pending';
  description: string;
}

export interface InstallmentPlanItem {
  id: string;
  milestoneTitle: string;
  percentage: number;
  amountAed: number;
  dueDate: string;
  status: 'Pending' | 'Invoiced' | 'Paid' | 'Overdue';
  paidDate?: string;
  receiptNumber?: string;
}

export interface TowerUnit {
  id: string;
  unitNumber: string;
  floor: number;
  floorCategory: FloorCategory;
  type: UnitType;
  areaSqft: number;
  priceAed: number; // Selling price
  allocatedCostAed: number; // Construction cost allocated to this unit
  projectedProfitAed: number; // priceAed - allocatedCostAed
  profitMarginPercent: number; // (projectedProfitAed / priceAed) * 100
  dldFeeAed: number; // 4% DLD
  oqoodFeeAed: number;
  status: UnitStatus;
  buyerName?: string;
  buyerPhone?: string;
  buyerNationality?: string;
  totalCollectedAed: number;
  paymentPlan: InstallmentPlanItem[];
  notes?: string;
}

export interface ConstructionMilestone {
  id: string;
  phaseOrder: number;
  title: string;
  code: string;
  targetPercent: number;
  actualPercent: number;
  targetDate: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  budgetAed: number;
  certifiedSpentAed: number;
  engineerSignOff: boolean;
}

export interface ContractorIpc {
  id: string;
  ipcNumber: string;
  period: string;
  contractorName: string;
  claimGrossAed: number;
  certifiedGrossAed: number;
  certifiedProgressPercent: number;
  retentionPercent: number; // 10% standard in UAE
  retentionDeductionAed: number;
  vatPercent: number; // 5% UAE VAT
  vatAmountAed: number;
  netPayableAed: number;
  status: 'Draft' | 'Certified' | 'Paid';
  dateSubmitted: string;
  datePaid?: string;
  engineerCertificateRef?: string;
}

export interface PostDatedCheque {
  id: string;
  chequeNumber: string;
  bankName: string;
  drawerName: string;
  unitNumber: string;
  amountAed: number;
  dueDate: string;
  status: 'In Hand' | 'Deposited' | 'Cleared' | 'Bounced';
  depositDate?: string;
}

export interface TowerProject {
  id: string;
  name: string;
  location: string;
  floorsCount: number;
  totalUnits: number;
  totalBuiltAreaSqft: number;
  gdvAed: number; // Gross Development Value (Total Sales Target)
  totalCostBudgetAed: number; // Total Construction Cost Budget
  escrowBank: string;
  escrowAccountNumber: string;
  reraProjectId: string;
  contractorName: string;
  consultantEngineer: string;
  overallConstructionPercent: number;
  salesProgressPercent: number;
  escrowBalanceAed: number;
  operatingBalanceAed: number;
  retentionFundAed: number;
  targetHandoverDate: string;
}

export interface FinancialTransaction {
  id: string;
  timestamp: string;
  type: 'INFLOW_SALES' | 'OUTFLOW_COST' | 'OUTFLOW_IPC' | 'OUTFLOW_RETENTION' | 'OUTFLOW_VAT' | 'DLD_GOV' | 'EXPENSE';
  title: string;
  amountAed: number;
  reference: string;
  escrowAccount: boolean;
}
