import { db } from "@/lib/db";
import { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const activeBudget = await db.budget.findFirst({
    where: { status: "ACTIVE" },
    include: { categories: true }
  });

  const totalBudget = activeBudget?.totalAmount || 0;
  
  // Aggregate approved expenses only
  const totalSpentAgg = await db.expense.aggregate({
    where: { status: "APPROVED" },
    _sum: { amount: true }
  });
  const totalSpent = totalSpentAgg._sum.amount || 0;

  const pendingApprovals = await db.expense.count({
    where: { status: "PENDING" }
  });

  // Category Breakdown
  const categories = activeBudget?.categories || [];
  const categoryUtilization = await Promise.all(categories.map(async (cat) => {
    const spentAgg = await db.expense.aggregate({
      where: { categoryId: cat.id, status: "APPROVED" },
      _sum: { amount: true }
    });
    return {
      name: cat.name,
      allocated: cat.allocated,
      spent: spentAgg._sum.amount || 0
    };
  }));

  // Monthly Trend (Last 6 months)
  const monthlyTrend = []; // In a real app, use complex SQL groupBy
  // Simplification for demo:
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const agg = await db.expense.aggregate({
        where: { 
            status: "APPROVED",
            date: { gte: d, lt: nextMonth }
        },
        _sum: { amount: true }
    });
    monthlyTrend.push({
        name: d.toLocaleDateString('en-US', { month: 'short' }),
        amount: agg._sum.amount || 0
    });
  }

  const recentExpenses = await db.expense.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: { category: true, submittedBy: true }
  });

  return {
    totalBudget,
    totalSpent,
    remainingBudget: totalBudget - totalSpent,
    pendingApprovals,
    categoryUtilization,
    monthlyTrend,
    recentExpenses
  };
}