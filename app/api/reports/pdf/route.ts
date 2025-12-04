import { NextResponse } from "next/server";
import { generateBudgetPdf } from "@/lib/reports/pdf";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const pdfBytes = await generateBudgetPdf();

    // --- FIX: convert to a SAFE ArrayBuffer ---
    let arrayBuffer: ArrayBuffer;

    if (pdfBytes instanceof Uint8Array) {
      arrayBuffer = pdfBytes.slice().buffer;  
      // slice() forces a NEW non-shared ArrayBuffer
    } 
    else if (pdfBytes instanceof ArrayBuffer) {
      arrayBuffer = pdfBytes;
    } 
    else if (typeof Buffer !== "undefined" && Buffer.isBuffer(pdfBytes)) {
      const buf = pdfBytes as Buffer;
      arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    } 
    else {
      throw new Error("Unsupported PDF byte format");
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="budget_report.pdf"',
      },
    });
  } catch (e) {
    console.error("PDF generation error:", e);
    return new NextResponse("Error generating report", { status: 500 });
  }
}