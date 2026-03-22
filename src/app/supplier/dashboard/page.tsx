"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SupplierLayout from "@/components/supplier/SupplierLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface SupplierUser {
  id: string;
  businessName: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
}

interface DashboardStats {
  totalProducts: number;
  pendingOrders: number;
  upcomingFairs: number;
}

const approvalBadge: Record<string, { variant: "secondary" | "success" | "error"; label: string }> = {
  PENDING: { variant: "secondary", label: "ממתין לאישור" },
  APPROVED: { variant: "success", label: "מאושר" },
  REJECTED: { variant: "error", label: "נדחה" },
};

export default function SupplierDashboardPage() {
  const router = useRouter();
  const [supplier, setSupplier] = useState<SupplierUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, pendingOrders: 0, upcomingFairs: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.role !== "SUPPLIER") {
          router.push("/login");
          return;
        }
        setSupplier({
          id: data.id,
          businessName: data.businessName || data.name || "ספק",
          approvalStatus: data.approvalStatus || "PENDING",
        });

        const [productsRes, ordersRes, fairsRes] = await Promise.allSettled([
          fetch("/api/supplier/products"),
          fetch("/api/supplier/orders"),
          fetch("/api/supplier/fairs"),
        ]);

        const products = productsRes.status === "fulfilled" && productsRes.value.ok
          ? await productsRes.value.json()
          : [];
        const orders = ordersRes.status === "fulfilled" && ordersRes.value.ok
          ? await ordersRes.value.json()
          : [];
        const fairs = fairsRes.status === "fulfilled" && fairsRes.value.ok
          ? await fairsRes.value.json()
          : [];

        setStats({
          totalProducts: Array.isArray(products) ? products.length : 0,
          pendingOrders: Array.isArray(orders)
            ? orders.filter((o: { status: string }) => o.status === "PENDING").length
            : 0,
          upcomingFairs: Array.isArray(fairs)
            ? fairs.filter((f: { date: string }) => new Date(f.date) >= new Date()).length
            : 0,
        });
      } catch {
        setError("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  if (loading) {
    return (
      <SupplierLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </SupplierLayout>
    );
  }

  if (error) {
    return (
      <SupplierLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-error text-lg">{error}</p>
        </div>
      </SupplierLayout>
    );
  }

  const approval = approvalBadge[supplier?.approvalStatus || "PENDING"];

  return (
    <SupplierLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              שלום, {supplier?.businessName}
            </h1>
            <p className="text-gray-500 mt-1">ברוכים הבאים לדשבורד הספק</p>
          </div>
          <Badge variant={approval.variant}>{approval.label}</Badge>
        </div>

        {/* Pending approval notice */}
        {supplier?.approvalStatus === "PENDING" && (
          <Card className="border-r-4 border-secondary bg-secondary/5">
            <p className="text-secondary font-medium">
              חשבונך ממתין לאישור אדמין
            </p>
            <p className="text-gray-500 text-sm mt-1">
              לאחר האישור תוכל להתחיל להוסיף מוצרים ולקבל הזמנות
            </p>
          </Card>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{stats.totalProducts}</p>
              <p className="text-gray-500 mt-1">סה&quot;כ מוצרים</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{stats.pendingOrders}</p>
              <p className="text-gray-500 mt-1">הזמנות ממתינות</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{stats.upcomingFairs}</p>
              <p className="text-gray-500 mt-1">ירידים קרובים</p>
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">פעולות מהירות</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/supplier/products?new=true">
              <Button variant="primary" size="md">
                הוסף מוצר
              </Button>
            </Link>
            <Link href="/supplier/orders">
              <Button variant="outline" size="md">
                צפה בהזמנות
              </Button>
            </Link>
            <Link href="/supplier/fairs?new=true">
              <Button variant="secondary" size="md">
                צור יריד
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
