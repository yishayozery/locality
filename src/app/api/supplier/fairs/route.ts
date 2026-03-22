import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { FairStatus } from "@/generated/prisma/enums";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies(request.cookies);
    if (!token) {
      return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (payload.role !== "SUPPLIER") {
      return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { userId: payload.userId },
    });
    if (!supplier) {
      return NextResponse.json({ error: "ספק לא נמצא" }, { status: 404 });
    }

    const fairs = await prisma.fair.findMany({
      where: { supplierId: supplier.id },
      include: { pickupPoint: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ fairs });
  } catch (error) {
    console.error("Supplier fairs GET error:", error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromCookies(request.cookies);
    if (!token) {
      return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (payload.role !== "SUPPLIER") {
      return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { userId: payload.userId },
    });
    if (!supplier) {
      return NextResponse.json({ error: "ספק לא נמצא" }, { status: 404 });
    }

    const { title, description, pickupPointId, date, startTime, endTime, image } =
      await request.json();

    if (!title || !pickupPointId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "חסרים שדות חובה: title, pickupPointId, date, startTime, endTime" },
        { status: 400 }
      );
    }

    const pickupPoint = await prisma.pickupPoint.findUnique({
      where: { id: pickupPointId },
    });
    if (!pickupPoint) {
      return NextResponse.json({ error: "נקודת איסוף לא נמצאה" }, { status: 400 });
    }

    const fair = await prisma.fair.create({
      data: {
        supplierId: supplier.id,
        pickupPointId,
        title,
        description: description || null,
        image: image || null,
        date: new Date(date),
        startTime,
        endTime,
        status: FairStatus.PENDING,
      },
      include: { pickupPoint: true },
    });

    return NextResponse.json({ fair }, { status: 201 });
  } catch (error) {
    console.error("Supplier fairs POST error:", error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
