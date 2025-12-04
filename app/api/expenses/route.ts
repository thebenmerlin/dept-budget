
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ActivityType } from "@prisma/client";
import { createAuditLog } from "@/services/audit.service";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const expenses = await db.expense.findMany({
      orderBy: { date: 'desc' },
      include: {
        category: true,
        submittedBy: { select: { name: true, email: true } },
        approvedBy: { select: { name: true } }
      }
    });
    return NextResponse.json(expenses);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { description, amount, date, categoryId, vendor, activityType, receiptUrl } = body;

    const expense = await db.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        categoryId,
        vendor,
        activityType: activityType as ActivityType,
        receiptUrl,
        submittedById: session.user.id,
        status: "PENDING"
      }
    });

    await createAuditLog({
        action: "EXPENSE_CREATED",
        entityId: expense.id,
        entityType: "EXPENSE",
        performedById: session.user.id,
        details: { amount: expense.amount, categoryId }
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
