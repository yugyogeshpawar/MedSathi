import { NextRequest, NextResponse } from "next/server";
import { getDoctorAvailability, setDoctorAvailability } from "@/services/availabilityService";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    const date = req.nextUrl.searchParams.get("date");
    
    if (!doctorId || !date) {
      return NextResponse.json({ success: false, error: "Missing doctorId or date" }, { status: 400 });
    }

    const avail = await getDoctorAvailability(doctorId, date);
    return NextResponse.json({ success: true, data: avail });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { doctorId, date, slots } = await req.json();
    if (!doctorId || !date || !Array.isArray(slots)) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    await setDoctorAvailability(doctorId, date, slots);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
