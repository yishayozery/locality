import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { OrderStatus } from "@/generated/prisma/enums";

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

    const statusParam = request.nextUrl.searchParams.get("status");

    const whereClause: Record<string, unknown> = {
      supplierId: supplier.id,
    };

    if (statusParam) {
      const upperStatus = statusParam.toUpperCase() as OrderStatus;
      if (!Object.values(OrderStatus).includes(upperStatus)) {
        return NextResponse.json(
          { error: `סטטוס לא חוקי. ערכים אפשריים: ${Object.values(OrderStatus).join(", ")}` },
          { status: 400 }
        );
      }
      whereClause.order = { status: upperStatus };
    }

    const orderItems = await prisma.orderItem.findMany({
      where: whereClause,
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: { select: { name: true } },
              },
            },
            pickupPoint: { select: { id: true, businessName: true, address: true } },
          },
        },
        product: true,
      },
      orderBy: { order: { createdAt: "desc" } },
    });

    return NextResponse.json({ orderItems });
  } catch (error) {
    console.error("Supplier orders GET error:", error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
