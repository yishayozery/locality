"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Step = "login" | "otp";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "שגיאה בהתחברות");
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

      // Redirect based on role
      const role = data.user?.role;
      switch (role) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "SUPPLIER":
          router.push("/supplier/dashboard");
          break;
        case "PICKUP_POINT":
          router.push("/pickup/dashboard");
          break;
        case "CUSTOMER":
        default:
          router.push("/customer/dashboard");
          break;
      }
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-bl from-primary/5 via-surface to-secondary/5 py-16">
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                🔐
              </div>
              <h1 className="text-3xl font-bold">כניסה למערכת</h1>
              <p className="mt-2 text-text-muted">
                {step === "login"
                  ? "הזינו את פרטי הכניסה שלכם"
                  : "הזינו את הקוד שנשלח אליכם ב-SMS"}
              </p>
            </div>

            <Card className="p-8">
              {/* Error message */}
              {error && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {step === "login" ? (
                <form onSubmit={handleLogin} className="space-y-5">
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
                      סיסמה
                    </label>
                    <input
                      type="password"
                      placeholder="הזינו סיסמה"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={inputClass}
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
                        מתחבר...
                      </span>
                    ) : (
                      "כניסה"
                    )}
                  </Button>
                </form>
              ) : (
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
                      setStep("login");
                      setOtp("");
                      setError("");
                    }}
                    className="w-full text-center text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    חזרה להתחברות
                  </button>
                </form>
              )}
            </Card>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-text-muted">
              אין לכם חשבון?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                הרשמה
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
