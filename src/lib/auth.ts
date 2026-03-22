import { SignJWT, jwtVerify } from "jose";
import { UserRole } from "@/generated/prisma/enums";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());

  return {
    userId: payload.userId as string,
    role: payload.role as UserRole,
  };
}

export function getTokenFromCookies(
  cookies: { get: (name: string) => { value: string } | undefined }
): string | null {
  const cookie = cookies.get("token");
  return cookie?.value ?? null;
}
