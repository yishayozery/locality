import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { generateOTP, sendSMS } from "@/lib/sms";
import { UserRole, ApprovalStatus } from "@/generated/prisma/enums";
import { PrismaClient } from "@/generated/prisma/client";

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, name, password, role, businessName, address, city } =
      body;

    // Validate required fields
    if (!phone || !name || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields: phone, name, password, role" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ["CUSTOMER", "SUPPLIER", "PICKUP_POINT"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be CUSTOMER, SUPPLIER, or PICKUP_POINT" },
        { status: 400 }
      );
    }

    // Role-specific validation
    if (role === "SUPPLIER" && !businessName) {
      return NextResponse.json(
        { error: "businessName is required for supplier registration" },
        { status: 400 }
      );
    }

    if (role === "PICKUP_POINT") {
      if (!businessName || !address || !city) {
        return NextResponse.json(
          {
            error:
              "businessName, address, and city are required for pickup point registration",
          },
          { status: 400 }
        );
      }
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this phone number already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and role-specific record in a transaction
    const user = await prisma.$transaction(async (tx: TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          phone,
          email: email || null,
          name,
          role: role as UserRole,
          passwordHash,
        },
      });

      if (role === "SUPPLIER") {
        await tx.supplier.create({
          data: {
            userId: newUser.id,
            businessName,
            approvalStatus: ApprovalStatus.PENDING,
          },
        });
      } else if (role === "PICKUP_POINT") {
        await tx.pickupPoint.create({
          data: {
            userId: newUser.id,
            businessName,
            address,
            city,
            approvalStatus: ApprovalStatus.PENDING,
          },
        });
      } else if (role === "CUSTOMER") {
        await tx.customer.create({
          data: {
            userId: newUser.id,
          },
        });
      }

      return newUser;
    });

    // Generate OTP and save
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.otpCode.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
      },
    });

    // Send OTP via SMS
    await sendSMS(phone, `Your LOCALITY verification code is: ${otpCode}`);

    return NextResponse.json(
      {
        success: true,
        userId: user.id,
        message: "Registration successful. OTP sent for verification.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
