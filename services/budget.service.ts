
import { db } from "@/lib/db";

export async function getCurrentBudget() {
  return await db.budget.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      categories: {
        include: {
          expenses: {
            where: { status: 'APPROVED' },
            select: { amount: true }
          }
        }
      }
    }
  });
}

export async function getCategories() {
  const budget = await getCurrentBudget();
  
  if (!budget) return [];

  return budget.categories.map(cat => {
    const spent = cat.expenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      ...cat,
      spent,
      remaining: cat.allocated - spent
    };
  });
}
