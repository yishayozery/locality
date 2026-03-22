"use client";

import { useEffect, useState } from "react";
import SupplierLayout from "@/components/supplier/SupplierLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Order {
  id: string;
  customerName: string;
  pickupPointName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
}

type FilterTab = "all" | "PENDING" | "CONFIRMED" | "READY_FOR_PICKUP" | "PICKED_UP";

const tabs: { value: FilterTab; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "PENDING", label: "ממתין" },
  { value: "CONFIRMED", label: "אושר" },
  { value: "READY_FOR_PICKUP", label: "מוכן לאיסוף" },
  { value: "PICKED_UP", label: "נאסף" },
];

const statusConfig: Record<string, { variant: "secondary" | "primary" | "success" | "neutral"; label: string }> = {
  PENDING: { variant: "secondary", label: "ממתין" },
  CONFIRMED: { variant: "primary", label: "אושר" },
  READY_FOR_PICKUP: { variant: "success", label: "מוכן לאיסוף" },
  PICKED_UP: { variant: "neutral", label: "נאסף" },
};

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/supplier/orders");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setError("שגיאה בטעינת ההזמנות");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filtered = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">הזמנות</h1>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="mr-1.5 text-xs opacity-70">
                  ({orders.filter((o) => o.status === tab.value).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-error text-lg">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg mt-4">אין הזמנות</p>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === "all" ? "הזמנות יופיעו כאן כשלקוחות יזמינו" : "אין הזמנות בסטטוס זה"}
              </p>
            </div>
          </Card>
        )}

        {/* Orders list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((order) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <Card key={order.id}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono text-gray-400">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">לקוח:</span>
                      <span className="font-medium text-gray-900">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">נקודת איסוף:</span>
                      <span className="font-medium text-gray-900">{order.pickupPointName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">מוצר:</span>
                      <span className="font-medium text-gray-900">{order.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">כמות:</span>
                      <span className="font-medium text-gray-900">{order.quantity}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
                      <span className="text-gray-500">סה&quot;כ:</span>
                      <span className="font-bold text-primary">{order.totalPrice.toFixed(2)} &#8362;</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
