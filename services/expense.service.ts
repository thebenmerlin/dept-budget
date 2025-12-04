import { db } from "@/lib/db";
import { ExpenseInput } from "@/validations/expense.schema";

export async function getExpenses() {
  return await db.expense.findMany({
    orderBy: { date: 'desc' },
    include: {
      category: true,
      submittedBy: { select: { name: true, email: true } },
      approvedBy: { select: { name: true } }
    }
  });
}

export async function createExpense(data: ExpenseInput & { submittedById: string, receiptUrl?: string }) {
  return await db.expense.create({
    data: {
      ...data,
      status: "PENDING",
    }
  });
}

export async function updateExpenseStatus(id: string, status: "APPROVED" | "REJECTED", approverId: string, reason?: string) {
  return await db.expense.update({
    where: { id },
    data: {
      status,
      rejectionReason: reason,
      approvedById: status === "APPROVED" ? approverId : null
    }
  });
}

export const ExpenseService = {
  getAll: getExpenses,
  create: createExpense,
  updateStatus: updateExpenseStatus
}