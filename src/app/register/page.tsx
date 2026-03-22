"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Role = "CUSTOMER" | "SUPPLIER" | "PICKUP_POINT";
type Step = "role" | "details" | "otp";

const ROLES: {
  value: Role;
  label: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    value: "CUSTOMER",
    label: "אני לקוח",
    icon: "🛍️",
    description: "רוצה לקנות מוצרים טריים ומקומיים",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary",
  },
  {
    value: "SUPPLIER",
    label: "אני ספק / חקלאי",
    icon: "🌾",
    description: "רוצה למכור מוצרים ישירות ללקוחות",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary",
  },
  {
    value: "PICKUP_POINT",
    label: "אני נקודת איסוף",
    icon: "🏪",
    description: "רוצה להפעיל נקודת איסוף שכונתית",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // OTP
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);

  function handleRoleSelect(role: Role) {
    setSelectedRole(role);
    setStep("details");
    setError("");
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setLoading(true);

    try {
      const body: Record<string, string> = {
        name,
        phone,
        email,
        password,
        role: selectedRole!,
      };

      if (selectedRole === "SUPPLIER") {
        body.businessName = businessName;
      }

      if (selectedRole === "PICKUP_POINT") {
        body.businessName = businessName;
        body.address = address;
        body.city = city;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "שגיאה בהרשמה");
        return;
      }

      setUserId(data.userId);
      setStep("otp");
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "קוד שגוי");
        return;
      }

      const role = data.user?.role || selectedRole;

      if (role === "CUSTOMER") {
        router.push("/customer/dashboard");
      } else {
        // SUPPLIER and PICKUP_POINT need admin approval
        setPendingApproval(true);
      }
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  // Step indicator
  const stepLabels = ["בחירת תפקיד", "פרטים", "אימות"];
  const stepIndex = step === "role" ? 0 : step === "details" ? 1 : 2;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-bl from-primary/5 via-surface to-secondary/5 py-16">
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-lg">
            {/* Title */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                ✨
              </div>
              <h1 className="text-3xl font-bold">הרשמה ל-LOCALITY</h1>
              <p className="mt-2 text-text-muted">
                הצטרפו לקהילת השיווק הישיר
              </p>
            </div>

            {/* Progress steps */}
            <div className="mb-8 flex items-center justify-center gap-2">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        i <= stepIndex
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {i < stepIndex ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        i <= stepIndex ? "text-primary" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div
                      className={`h-0.5 w-8 rounded ${
                        i < stepIndex ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Pending approval message */}
            {pendingApproval ? (
              <Card className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-4xl">
                  ⏳
                </div>
                <h2 className="mb-3 text-xl font-bold">ההרשמה התקבלה!</h2>
                <p className="mb-6 text-text-muted leading-relaxed">
                  חשבונך ממתין לאישור אדמין.
                  <br />
                  נעדכן אותך ברגע שהחשבון יאושר.
                </p>
                <Link href="/">
                  <Button variant="primary" size="lg" className="w-full">
                    חזרה לדף הבית
                  </Button>
                </Link>
              </Card>
            ) : step === "role" ? (
              /* Step 1: Role selection */
              <div className="grid gap-4">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleSelect(role.value)}
                    className="text-right"
                  >
                    <Card
                      className={`cursor-pointer border-2 border-transparent transition-all hover:scale-[1.02] hover:${role.borderColor} p-6`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${role.bgColor} text-3xl`}
                        >
                          {role.icon}
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-bold ${role.color}`}
                          >
                            {role.label}
                          </h3>
                          <p className="text-sm text-text-muted">
                            {role.description}
                          </p>
                        </div>
                        <div className="mr-auto text-gray-300">
                          <svg
                            className="h-6 w-6 rotate-180"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            ) : step === "details" ? (
              /* Step 2: Registration form */
              <Card className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setStep("role");
                      setError("");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <h2 className="text-lg font-bold">
                    {ROLES.find((r) => r.value === selectedRole)?.label}
                  </h2>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      שם מלא
                    </label>
                    <input
                      type="text"
                      placeholder="הזינו שם מלא"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        טלפון נייד
                      </label>
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="050-0000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        אימייל
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {(selectedRole === "SUPPLIER" ||
                    selectedRole === "PICKUP_POINT") && (
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        שם העסק
                      </label>
                      <input
                        type="text"
                        placeholder="הזינו שם עסק"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>
                  )}

                  {selectedRole === "PICKUP_POINT" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          כתובת
                        </label>
                        <input
                          type="text"
                          placeholder="רחוב ומספר"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          עיר
                        </label>
                        <input
                          type="text"
                          placeholder="שם העיר"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        סיסמה
                      </label>
                      <input
                        type="password"
                        placeholder="לפחות 6 תווים"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        אימות סיסמה
                      </label>
                      <input
                        type="password"
                        placeholder="הזינו שוב"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        נרשם...
                      </span>
                    ) : (
                      "הרשמה"
                    )}
                  </Button>
                </form>
              </Card>
            ) : (
              /* Step 3: OTP */
              <Card className="p-8">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    📱
                  </div>
                  <h2 className="text-lg font-bold">אימות מספר טלפון</h2>
                  <p className="mt-1 text-sm text-text-muted">
                    שלחנו קוד אימות ב-SMS למספר {phone}
                  </p>
                </div>

                <form onSubmit={handleOtp} className="space-y-5">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      קוד אימות (6 ספרות)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      required
                      className={`${inputClass} text-center text-2xl tracking-[0.5em] font-mono`}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        מאמת...
                      </span>
                    ) : (
                      "אימות"
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("details");
                      setOtp("");
                      setError("");
                    }}
                    className="w-full text-center text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    חזרה לטופס
                  </button>
                </form>
              </Card>
            )}

            {/* Login link */}
            {!pendingApproval && (
              <p className="mt-6 text-center text-sm text-text-muted">
                כבר יש לכם חשבון?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  כניסה
                </Link>
              </p>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
