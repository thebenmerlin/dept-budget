
import { NextResponse } from "next/server";
import { generateBudgetPdf } from "@/lib/reports/pdf";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const pdfBytes = await generateBudgetPdf();
        
        return new NextResponse(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="budget_report.pdf"'
            }
        });
    } catch (e) {
        console.error(e);
        return new NextResponse("Error generating report", { status: 500 });
    }
}
