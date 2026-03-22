import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = getTokenFromCookies(cookieStore);

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Build include object based on role
    const include: Record<string, boolean> = {};
    if (payload.role === "SUPPLIER") {
      include.supplier = true;
    } else if (payload.role === "PICKUP_POINT") {
      include.pickupPoint = true;
    } else if (payload.role === "CUSTOMER") {
      include.customer = true;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
