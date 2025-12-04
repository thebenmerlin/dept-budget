
import * as XLSX from 'xlsx';
import { db } from '@/lib/db';

export async function generateExpensesExcel() {
    const expenses = await db.expense.findMany({
        include: {
            category: true,
            submittedBy: true,
            approvedBy: true
        },
        orderBy: { date: 'desc' }
    });

    const data = expenses.map(e => ({
        ID: e.id,
        Date: e.date.toISOString().split('T')[0],
        Description: e.description,
        Amount: e.amount,
        Category: e.category.name,
        Vendor: e.vendor,
        Type: e.activityType,
        Status: e.status,
        SubmittedBy: e.submittedBy.name,
        ApprovedBy: e.approvedBy?.name || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buf;
}
