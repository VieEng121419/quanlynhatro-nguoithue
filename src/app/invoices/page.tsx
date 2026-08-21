"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useInvoices } from "@/hooks/useInvoices";
import { getInvoiceDisplayStatus } from "@/lib/invoice-utils";
import { InvoiceCard } from "@/components/invoice/InvoiceCard";

type TabKey = "all" | "unpaid" | "overdue" | "paid";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "unpaid", label: "Chưa thanh toán" },
  { key: "overdue", label: "Quá hạn" },
  { key: "paid", label: "Đã thanh toán" },
];

// Các trạng thái hiển thị thuộc nhóm "Chưa thanh toán" (chưa quá hạn)
const UNPAID_DISPLAY_STATUSES = ["UNPAID", "PARTIAL", "DUE"];

export default function InvoicesPage() {
  const { invoices, loading, error } = useInvoices();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filteredInvoices = useMemo(() => {
    if (activeTab === "unpaid") {
      return invoices.filter((inv) =>
        UNPAID_DISPLAY_STATUSES.includes(
          getInvoiceDisplayStatus(inv.status, inv.toDate)
        )
      );
    }
    if (activeTab === "overdue") {
      return invoices.filter(
        (inv) => getInvoiceDisplayStatus(inv.status, inv.toDate) === "OVERDUE"
      );
    }
    if (activeTab === "paid") {
      return invoices.filter(
        (inv) => getInvoiceDisplayStatus(inv.status, inv.toDate) === "PAID"
      );
    }
    return invoices;
  }, [invoices, activeTab]);

  return (
    <div className="min-h-[calc(100vh-4rem)] mt-[72px]">
      <div className="max-w-[390px] mx-auto flex flex-col gap-6 px-4 pb-4 pt-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-[20px] font-bold text-[#251915] text-left w-full">
            Hóa đơn
          </h1>

          {/* Pill sub-tabs */}
          <div className="w-full flex gap-3 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-3 rounded-[20px] text-[14px] font-semibold transition-colors whitespace-nowrap",
                  activeTab === tab.key
                    ? "bg-[#0051D5] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                    : "bg-[#FBE3DD] text-[#58413C]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-lg text-[#6B7280]">
              Đang tải danh sách hoá đơn...
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 px-4">
            <p className="text-lg text-red-600 text-center">{error}</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-lg text-[#6B7280]">Không có hoá đơn</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
