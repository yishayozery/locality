import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { ApprovalStatus } from "@/generated/prisma/enums";

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

    const products = await prisma.product.findMany({
      where: { supplierId: supplier.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Supplier products GET error:", error);
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

    const { name, description, categoryId, unitType, supplierPrice, cutoffDate, image } =
      await request.json();

    if (!name || !categoryId || !unitType || supplierPrice == null) {
      return NextResponse.json(
        { error: "חסרים שדות חובה: name, categoryId, unitType, supplierPrice" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json({ error: "קטגוריה לא נמצאה" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        supplierId: supplier.id,
        name,
        description: description || null,
        categoryId,
        unitType,
        supplierPrice,
        cutoffDate: cutoffDate ? new Date(cutoffDate) : null,
        image: image || null,
        approvalStatus: ApprovalStatus.PENDING,
      },
      include: { category: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Supplier products POST error:", error);
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
