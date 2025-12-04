
import { NextResponse } from "next/server";
import { generateExpensesExcel } from "@/lib/reports/excel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const buffer = await generateExpensesExcel();
        
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="expenses_audit.xlsx"'
            }
        });
    } catch (e) {
        console.error(e);
        return new NextResponse("Error generating report", { status: 500 });
    }
}
