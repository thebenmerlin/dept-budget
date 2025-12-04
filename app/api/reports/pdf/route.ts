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

    // Predeclare arrayBuffer as ArrayBuffer
    let arrayBuffer: ArrayBuffer;

    if (pdfBytes instanceof Uint8Array) {
      // Uint8Array → force new ArrayBuffer
      const copy = pdfBytes.slice(); // copy into a new buffer
      arrayBuffer = copy.buffer;
    } 
    else if (
      typeof Buffer !== "undefined" &&
      (pdfBytes as any)?.constructor?.name === "Buffer"
    ) {
      // Node Buffer → convert manually
      const buf = pdfBytes as Buffer;
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      arrayBuffer = ab as ArrayBuffer; // <-- explicit cast fixes TS error
    } 
    else {
      throw new Error("Unsupported PDF byte format returned from generateBudgetPdf()");
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