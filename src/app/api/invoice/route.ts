import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/verifyAuth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { patientName, serviceType, date, amount, bookingId } = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText("MedSathi Dashboard Invoice", { x: 50, y: 350, size: 24, font: helveticaBold, color: rgb(0, 0.5, 0.8) });
    
    page.drawText(`Invoice ID: ${bookingId}`, { x: 50, y: 310, size: 12, font: helveticaFont });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 400, y: 310, size: 12, font: helveticaFont });

    page.drawLine({ start: { x: 50, y: 290 }, end: { x: 550, y: 290 }, thickness: 2, color: rgb(0.8, 0.8, 0.8) });

    page.drawText(`Patient Name:`, { x: 50, y: 260, size: 12, font: helveticaBold });
    page.drawText(patientName, { x: 150, y: 260, size: 12, font: helveticaFont });

    page.drawText(`Target Date:`, { x: 50, y: 230, size: 12, font: helveticaBold });
    page.drawText(date, { x: 150, y: 230, size: 12, font: helveticaFont });

    page.drawText(`Service Type:`, { x: 50, y: 200, size: 12, font: helveticaBold });
    page.drawText(serviceType.toUpperCase(), { x: 150, y: 200, size: 12, font: helveticaFont });

    page.drawLine({ start: { x: 50, y: 170 }, end: { x: 550, y: 170 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });

    page.drawText(`Total Amount:`, { x: 350, y: 140, size: 16, font: helveticaBold });
    page.drawText(`₹${amount}`, { x: 470, y: 140, size: 16, font: helveticaBold, color: rgb(0, 0.5, 0) });

    page.drawText("Thank you for choosing MedSathi Healthcare Services.", { x: 50, y: 50, size: 10, font: helveticaFont, color: rgb(0.5, 0.5, 0.5) });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${bookingId}.pdf`
      }
    });

  } catch (error: any) {
    console.error("Invoice generation error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate PDF invoice" }, { status: 500 });
  }
}
