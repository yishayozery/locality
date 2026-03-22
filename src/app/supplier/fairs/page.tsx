"use client";

import { useEffect, useState } from "react";
import SupplierLayout from "@/components/supplier/SupplierLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Fair {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  pickupPoint?: { name: string };
  pickupPointName?: string;
  status: string;
}

const statusConfig: Record<string, { variant: "secondary" | "success" | "primary" | "neutral"; label: string }> = {
  DRAFT: { variant: "neutral", label: "טיוטה" },
  PENDING: { variant: "secondary", label: "ממתין לאישור" },
  APPROVED: { variant: "success", label: "מאושר" },
  ACTIVE: { variant: "primary", label: "פעיל" },
  COMPLETED: { variant: "neutral", label: "הסתיים" },
};

const emptyForm = {
  title: "",
  description: "",
  pickupPointId: "",
  date: "",
  startTime: "",
  endTime: "",
};

export default function SupplierFairsPage() {
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("new") === "true") {
      setShowForm(true);
    }
  }, []);

  useEffect(() => {
    fetchFairs();
  }, []);

  async function fetchFairs() {
    try {
      setLoading(true);
      const res = await fetch("/api/supplier/fairs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFairs(Array.isArray(data) ? data : []);
    } catch {
      setError("שגיאה בטעינת הירידים");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/supplier/fairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "שגיאה ביצירת היריד");
      }
      setForm(emptyForm);
      setShowForm(false);
      await fetchFairs();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "שגיאה ביצירת היריד");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">ירידים</h1>
          <Button
            variant={showForm ? "ghost" : "primary"}
            size="md"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "ביטול" : "צור יריד חדש"}
          </Button>
        </div>

        {/* Inline form */}
        {showForm && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">יריד חדש</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם היריד</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="למשל: יריד ירקות אביב"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">נקודת איסוף (מזהה)</label>
                  <input
                    type="text"
                    required
                    value={form.pickupPointId}
                    onChange={(e) => setForm({ ...form, pickupPointId: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="מזהה נקודת האיסוף"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שעת התחלה</label>
                    <input
                      type="time"
                      required
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שעת סיום</label>
                    <input
                      type="time"
                      required
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="תיאור היריד..."
                />
              </div>
              {submitError && <p className="text-error text-sm">{submitError}</p>}
              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "יוצר..." : "צור יריד"}
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
            <Button variant="ghost" size="sm" onClick={fetchFairs} className="mt-3">
              נסה שוב
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && fairs.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg mt-4">אין ירידים</p>
              <p className="text-gray-400 text-sm mt-1">לחץ על &quot;צור יריד חדש&quot; כדי להתחיל</p>
            </div>
          </Card>
        )}

        {/* Fairs grid */}
        {!loading && !error && fairs.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fairs.map((fair) => {
              const status = statusConfig[fair.status] || statusConfig.PENDING;
              return (
                <Card key={fair.id}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{fair.title}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  {fair.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{fair.description}</p>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">תאריך:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(fair.date).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">שעות:</span>
                      <span className="font-medium text-gray-900">
                        {fair.startTime} - {fair.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">נקודת איסוף:</span>
                      <span className="font-medium text-gray-900">
                        {fair.pickupPoint?.name || fair.pickupPointName || "-"}
                      </span>
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
