import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromCookies(request.cookies);
    if (!token) {
      return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "אין הרשאה" }, { status: 403 });
    }

    const { entityType, entityId, action } = await request.json();

    if (!entityType || !entityId || !action) {
      return NextResponse.json(
        { error: "חסרים שדות: entityType, entityId, action" },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { error: "action חייב להיות APPROVED או REJECTED" },
        { status: 400 }
      );
    }

    const status = action as "APPROVED" | "REJECTED";
    const now = new Date();

    if (entityType === "supplier") {
      await prisma.supplier.update({
        where: { id: entityId },
        data: {
          approvalStatus: status,
          approvedAt: status === "APPROVED" ? now : null,
        },
      });
    } else if (entityType === "pickup_point") {
      await prisma.pickupPoint.update({
        where: { id: entityId },
        data: {
          approvalStatus: status,
          approvedAt: status === "APPROVED" ? now : null,
        },
      });
    } else if (entityType === "product") {
      await prisma.product.update({
        where: { id: entityId },
        data: { approvalStatus: status },
      });
    } else {
      return NextResponse.json(
        { error: "entityType לא חוקי" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${entityType} ${status === "APPROVED" ? "אושר" : "נדחה"} בהצלחה`,
    });
  } catch (error) {
    console.error("Admin approve error:", error);
    return NextResponse.json(
      { error: "שגיאת שרת" },
      { status: 500 }
    );
  }
}
