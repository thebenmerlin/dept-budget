import { User, Budget, Category, Expense, DashboardStats } from '../types';

// Initial Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Dr. John Doe',
  email: 'hod@college.edu',
  role: 'HOD',
  department: 'Computer Science'
};

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b1', academicYear: '2023-2024', totalAmount: 5000000, allocatedAmount: 4800000, remainingAmount: 3200000, status: 'ACTIVE' }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Laboratory Equipment', budgetId: 'b1', allocated: 2000000, spent: 1200000, remaining: 800000 },
  { id: 'c2', name: 'Software Licenses', budgetId: 'b1', allocated: 1000000, spent: 400000, remaining: 600000 },
  { id: 'c3', name: 'Events & Workshops', budgetId: 'b1', allocated: 800000, spent: 150000, remaining: 650000 },
  { id: 'c4', name: 'Travel & Allowance', budgetId: 'b1', allocated: 500000, spent: 50000, remaining: 450000 },
  { id: 'c5', name: 'Stationery', budgetId: 'b1', allocated: 500000, spent: 0, remaining: 500000 },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', description: 'High Performance Dell Servers', amount: 800000, date: '2023-08-15', categoryId: 'c1', categoryName: 'Laboratory Equipment', vendor: 'Dell Enterprise', activityType: 'Infrastructure', status: 'APPROVED', submittedBy: 'Staff Member A' },
  { id: 'e2', description: 'Matlab Campus License', amount: 400000, date: '2023-09-01', categoryId: 'c2', categoryName: 'Software Licenses', vendor: 'MathWorks', activityType: 'Software', status: 'APPROVED', submittedBy: 'Staff Member B' },
  { id: 'e3', description: 'IoT Workshop Kits', amount: 150000, date: '2023-10-10', categoryId: 'c3', categoryName: 'Events & Workshops', vendor: 'ElectroComponents', activityType: 'Workshop', status: 'PENDING', submittedBy: 'Staff Member A' },
  { id: 'e4', description: 'Travel to IEEE Conference', amount: 50000, date: '2023-11-05', categoryId: 'c4', categoryName: 'Travel & Allowance', vendor: 'Air India', activityType: 'Conference', status: 'APPROVED', submittedBy: 'Staff Member C' },
  { id: 'e5', description: '40x i7 Desktops', amount: 400000, date: '2023-12-12', categoryId: 'c1', categoryName: 'Laboratory Equipment', vendor: 'HP India', activityType: 'Infrastructure', status: 'APPROVED', submittedBy: 'Staff Member A' },
];

class MockService {
  private user: User = MOCK_USER;
  private budgets: Budget[] = INITIAL_BUDGETS;
  private categories: Category[] = INITIAL_CATEGORIES;
  private expenses: Expense[] = INITIAL_EXPENSES;

  // Simulate async delay
  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string): Promise<User> {
    await this.delay(800);
    // Mock login logic
    if (email.includes('admin')) this.user = { ...MOCK_USER, role: 'ADMIN', name: 'Administrator' };
    else if (email.includes('staff')) this.user = { ...MOCK_USER, role: 'STAFF', name: 'Prof. Smith' };
    else this.user = { ...MOCK_USER, role: 'HOD', name: 'Dr. John Doe' };
    
    return this.user;
  }

  async getCurrentUser(): Promise<User> {
    return this.user;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    await this.delay();
    const activeBudget = this.budgets.find(b => b.status === 'ACTIVE');
    const totalSpent = this.expenses
      .filter(e => e.status === 'APPROVED')
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      totalBudget: activeBudget?.totalAmount || 0,
      totalSpent,
      remainingBudget: (activeBudget?.totalAmount || 0) - totalSpent,
      pendingApprovals: this.expenses.filter(e => e.status === 'PENDING').length,
      categoryUtilization: this.categories.map(c => ({
        name: c.name,
        allocated: c.allocated,
        spent: c.spent
      })),
      monthlyTrend: [
        { name: 'Jan', amount: 45000 },
        { name: 'Feb', amount: 52000 },
        { name: 'Mar', amount: 48000 },
        { name: 'Apr', amount: 61000 },
        { name: 'May', amount: 55000 },
        { name: 'Jun', amount: 67000 },
      ],
      recentExpenses: this.expenses.slice(0, 5)
    };
  }

  async getCategories(): Promise<Category[]> {
    await this.delay();
    return [...this.categories];
  }

  async getExpenses(): Promise<Expense[]> {
    await this.delay();
    return [...this.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addExpense(expense: Omit<Expense, 'id' | 'status' | 'categoryName'>): Promise<Expense> {
    await this.delay(1000);
    const category = this.categories.find(c => c.id === expense.categoryId);
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      categoryName: category?.name || 'Unknown'
    };
    this.expenses = [newExpense, ...this.expenses];
    return newExpense;
  }

  async approveExpense(id: string): Promise<void> {
    await this.delay();
    const expense = this.expenses.find(e => e.id === id);
    if (expense) {
      expense.status = 'APPROVED';
      // Update category totals
      const category = this.categories.find(c => c.id === expense.categoryId);
      if (category) {
        category.spent += expense.amount;
        category.remaining -= expense.amount;
      }
    }
  }

  async rejectExpense(id: string): Promise<void> {
    await this.delay();
    const expense = this.expenses.find(e => e.id === id);
    if (expense) {
      expense.status = 'REJECTED';
    }
  }
}

export const mockService = new MockService();