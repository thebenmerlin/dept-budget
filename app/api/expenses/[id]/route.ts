
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/services/audit.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const expense = await db.expense.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        submittedBy: { select: { name: true, email: true, department: true } },
        approvedBy: { select: { name: true } },
      },
    });

    if (!expense) return new NextResponse("Expense not found", { status: 404 });

    // Access control: User can see their own, or Admin/HOD can see all
    if (
      session.user.role === "STAFF" &&
      expense.submittedById !== session.user.id
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  // Only Admin or HOD can approve/reject
  if (session.user.role === 'STAFF') {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const { status, rejectionReason } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
        return new NextResponse("Invalid Status", { status: 400 });
    }

    if (status === 'REJECTED' && !rejectionReason) {
        return new NextResponse("Rejection reason is required", { status: 400 });
    }

    // Construct update data explicitly to avoid null/undefined confusion
    const updateData: any = {
        status,
        // If Approved, set approver and clear rejection reason
        // If Rejected, clear approver and set rejection reason
        approvedById: status === 'APPROVED' ? session.user.id : null,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
    };

    const expense = await db.expense.update({
      where: { id: params.id },
      data: updateData
    });

    // Create Audit Log (wrapped in try/catch so it doesn't fail the request if log fails)
    try {
        await createAuditLog({
            action: `EXPENSE_${status}`,
            entityId: expense.id,
            entityType: "EXPENSE",
            performedById: session.user.id,
            details: { 
                previousStatus: "PENDING", 
                newStatus: status,
                reason: rejectionReason || undefined
            }
        });
    } catch (logError) {
        console.error("Failed to create audit log:", logError);
    }

    return NextResponse.json(expense);
  } catch (error: any) {
    console.error("Error updating expense:", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  if (session.user.role !== 'ADMIN') {
      return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    await db.expense.delete({
      where: { id: params.id }
    });
    
    // Log deletion
    try {
        await createAuditLog({
            action: "EXPENSE_DELETED",
            entityId: params.id,
            entityType: "EXPENSE",
            performedById: session.user.id
        });
    } catch (logError) {
         console.error("Failed to create audit log:", logError);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
