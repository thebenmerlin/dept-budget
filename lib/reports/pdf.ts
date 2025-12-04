
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { db } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

export async function generateBudgetPdf() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const budget = await db.budget.findFirst({
        where: { status: 'ACTIVE' },
        include: { categories: true }
    });

    let y = height - 50;

    // Header
    page.drawText('Department Budget Report', { x: 50, y, size: 20, font: boldFont, color: rgb(0, 0, 0) });
    y -= 30;
    page.drawText(`Academic Year: ${budget?.academicYear || 'N/A'}`, { x: 50, y, size: 12, font });
    y -= 40;

    // Table Header
    page.drawText('Category', { x: 50, y, size: 12, font: boldFont });
    page.drawText('Allocated', { x: 250, y, size: 12, font: boldFont });
    page.drawText('Status', { x: 400, y, size: 12, font: boldFont });
    y -= 20;
    page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 20;

    // Rows
    if (budget?.categories) {
        for (const cat of budget.categories) {
            page.drawText(cat.name, { x: 50, y, size: 10, font });
            page.drawText(formatCurrency(cat.allocated), { x: 250, y, size: 10, font });
            page.drawText('Active', { x: 400, y, size: 10, font });
            y -= 20;
        }
    }

    y -= 20;
    page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0, 0, 0) });
    y -= 30;
    page.drawText(`Total Budget: ${formatCurrency(budget?.totalAmount || 0)}`, { x: 50, y, size: 12, font: boldFont });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
