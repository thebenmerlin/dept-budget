
import { db } from "@/lib/db";

export async function createAuditLog(data: {
  action: string;
  entityId: string;
  entityType: string;
  performedById: string;
  details?: any;
}) {
  return await db.auditLog.create({
    data: {
      action: data.action,
      entityId: data.entityId,
      entityType: data.entityType,
      performedById: data.performedById,
      details: data.details ? JSON.stringify(data.details) : undefined,
    },
  });
}

export async function getAuditLogs(entityId?: string) {
  const where = entityId ? { entityId } : {};
  
  return await db.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      performedBy: {
        select: { name: true, email: true, role: true },
      },
    },
  });
}