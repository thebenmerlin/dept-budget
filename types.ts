export type Role = 'ADMIN' | 'HOD' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
}

export interface Budget {
  id: string;
  academicYear: string;
  totalAmount: number;
  allocatedAmount: number; // For categories
  remainingAmount: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

export interface Category {
  id: string;
  name: string;
  budgetId: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  categoryId: string;
  categoryName: string;
  vendor: string;
  activityType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  receiptUrl?: string;
  submittedBy: string;
}

export interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  pendingApprovals: number;
  categoryUtilization: { name: string; allocated: number; spent: number }[];
  monthlyTrend: { name: string; amount: number }[];
  recentExpenses: any[];
}