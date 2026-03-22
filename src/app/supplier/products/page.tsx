"use client";

import { useEffect, useState } from "react";
import SupplierLayout from "@/components/supplier/SupplierLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Product {
  id: string;
  name: string;
  category?: { name: string };
  categoryId?: string;
  unitType: string;
  supplierPrice: number;
  approvalStatus: string;
  cutoffDate: string;
  description?: string;
  imageUrl?: string;
}

const categories = [
  { id: "cat-1", name: "ירקות" },
  { id: "cat-2", name: "פירות" },
  { id: "cat-3", name: "מאפים" },
  { id: "cat-4", name: "חלב וגבינות" },
  { id: "cat-5", name: "ביצים" },
  { id: "cat-6", name: "דבש וריבות" },
];

const unitTypes = [
  { value: "kg", label: 'ק"ג' },
  { value: "unit", label: "יחידה" },
  { value: "package", label: "חבילה" },
];

const statusBadge: Record<string, { variant: "secondary" | "success" | "error" | "neutral"; label: string }> = {
  PENDING: { variant: "secondary", label: "ממתין לאישור" },
  APPROVED: { variant: "success", label: "מאושר" },
  REJECTED: { variant: "error", label: "נדחה" },
};

const emptyForm = {
  name: "",
  description: "",
  categoryId: "",
  unitType: "kg",
  supplierPrice: "",
  cutoffDate: "",
  imageUrl: "",
};

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Open form if ?new=true
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("new") === "true") {
      setShowForm(true);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/supplier/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setError("שגיאה בטעינת המוצרים");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/supplier/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          supplierPrice: parseFloat(form.supplierPrice),
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "שגיאה ביצירת המוצר");
      }
      setForm(emptyForm);
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "שגיאה ביצירת המוצר");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">מוצרים</h1>
          <Button
            variant={showForm ? "ghost" : "primary"}
            size="md"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "ביטול" : "הוסף מוצר חדש"}
          </Button>
        </div>

        {/* Inline form */}
        {showForm && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">מוצר חדש</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם המוצר</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="למשל: עגבניות שרי"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="">בחר קטגוריה</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">סוג יחידה</label>
                  <select
                    required
                    value={form.unitType}
                    onChange={(e) => setForm({ ...form, unitType: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    {unitTypes.map((ut) => (
                      <option key={ut.value} value={ut.value}>{ut.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מחיר ספק</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.supplierPrice}
                    onChange={(e) => setForm({ ...form, supplierPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תאריך סגירת הזמנות</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.cutoffDate}
                    onChange={(e) => setForm({ ...form, cutoffDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">כתובת תמונה (URL)</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="תיאור קצר של המוצר..."
                />
              </div>
              {submitError && <p className="text-error text-sm">{submitError}</p>}
              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "שומר..." : "שמור מוצר"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  ביטול
                </Button>
              </div>
            </form>
          </Card>
        )}

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
            <Button variant="ghost" size="sm" onClick={fetchProducts} className="mt-3">
              נסה שוב
            </Button>
          </div>
        )}

        {/* Products list */}
        {!loading && !error && products.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">אין מוצרים עדיין</p>
              <p className="text-gray-400 text-sm mt-1">לחץ על &quot;הוסף מוצר חדש&quot; כדי להתחיל</p>
            </div>
          </Card>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-right py-3 px-4 font-medium">שם</th>
                  <th className="text-right py-3 px-4 font-medium">קטגוריה</th>
                  <th className="text-right py-3 px-4 font-medium">מחיר</th>
                  <th className="text-right py-3 px-4 font-medium">יחידה</th>
                  <th className="text-right py-3 px-4 font-medium">סגירת הזמנות</th>
                  <th className="text-right py-3 px-4 font-medium">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const status = statusBadge[product.approvalStatus] || statusBadge.PENDING;
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                      <td className="py-3 px-4 text-gray-600">{product.category?.name || "-"}</td>
                      <td className="py-3 px-4 text-gray-600">{product.supplierPrice.toFixed(2)} &#8362;</td>
                      <td className="py-3 px-4 text-gray-600">
                        {unitTypes.find((u) => u.value === product.unitType)?.label || product.unitType}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(product.cutoffDate).toLocaleDateString("he-IL")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
