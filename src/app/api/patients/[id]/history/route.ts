import { NextRequest, NextResponse } from "next/server";
import { getPatientHistory } from "@/services/patientService";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    // Await params if using newer Next.js patterns, otherwise it's just params.id
    const { id } = await params;
    const history = await getPatientHistory(id);
    return NextResponse.json({ success: true, data: history });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
