"use client";

import { TriangleAlert, Receipt, CheckCircle2, ChevronRight, FileText, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatInvoicePeriod, formatDueDate, INVOICE_STATUS_LABELS } from "@/lib/invoice-utils";
import type { Invoice } from "@/hooks/useInvoices";

interface InvoiceCardProps {
  invoice: Invoice;
  className?: string;
}

export function InvoiceCard({ invoice, className }: InvoiceCardProps) {
  const { status } = invoice;
  const label = INVOICE_STATUS_LABELS[status] ?? status;
  const period = formatInvoicePeriod(invoice.fromDate);
  const dueDate = formatDueDate(invoice.toDate);
  const amount = formatCurrency(invoice.totalAmount);

  // Card quá hạn: vạch đỏ trái, nền trắng, viền hồng
  if (status === "OVERDUE") {
    return (
      <div
        className={cn(
          "relative bg-white border border-[#FFDAD6] rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden",
          className,
        )}
      >
        {/* Vạch đỏ trái */}
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#BA1A1A]" />

        <div className="pl-8 pr-4 py-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-[20px] bg-[#FFDAD6] flex items-center justify-center shrink-0">
              <TriangleAlert className="w-[22px] h-[19px] text-[#BA1A1A]" />
            </div>

            {/* Title + Status */}
            <div className="flex-1 min-w-0 flex gap-1.5 flex-col">
              <h3 className="text-[14px] font-semibold text-[#251915] leading-[20px] truncate">
                {period}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex px-2 py-0.5 bg-[#BA1A1A] rounded-[20px]">
                  <span className="text-[12px] font-bold tracking-[0.05em] text-white leading-[16px]">
                    {label}
                  </span>
                </span>
                <span className="text-[14px] font-medium tracking-[0.02em] text-[#BA1A1A] leading-[18px]">
                  Hạn: {dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#FBE3DD] mt-3 pt-3 flex items-center justify-between pl-8">
            <div>
              <p className="text-[14px] text-[#58413C] leading-[20px]">Tổng tiền:</p>
              <p className="text-[14px] font-bold text-[#A73414] leading-[20px]">{amount}</p>
            </div>
            <div className="w-12 h-12 rounded-[20px] bg-[#FBE3DD] flex items-center justify-center shrink-0">
              <ChevronRight className="w-4 h-4 text-[#251915]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card chưa thanh toán / chưa thanh toán đủ: nền trắng, icon xanh
  if (status === "UNPAID" || status === "PARTIAL") {
    return (
      <div
        className={cn(
          "bg-white rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden",
          className,
        )}
      >
        <div className="px-4 py-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-[20px] bg-[#316BF3] flex items-center justify-center shrink-0">
              <Receipt className="w-[18px] h-[20px] text-[#FEFCFF]" />
            </div>

            {/* Title + Status */}
            <div className="flex-1 min-w-0 flex gap-1.5 flex-col">
              <h3 className="text-[14px] font-semibold text-[#251915] leading-[20px] truncate">
                {period}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex px-2 py-0.5 bg-[#F5DDD8] rounded-[20px]">
                  <span className="text-[12px] font-bold tracking-[0.05em] text-[#58413C] leading-[16px] whitespace-nowrap">
                    {label}
                  </span>
                </span>
                <span className="text-[14px] font-medium tracking-[0.02em] text-[#58413C] leading-[18px] whitespace-nowrap">
                  Hạn: {dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#FBE3DD] mt-3 pt-3 flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#58413C] leading-[20px]">Tổng tiền:</p>
              <p className="text-[14px] font-bold text-[#251915] leading-[20px]">{amount}</p>
            </div>
            <div className="w-12 h-12 rounded-[20px] bg-[#0051D5] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center shrink-0">
              <ChevronRight className="w-[19px] h-[18px] text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card đã thanh toán: opacity 0.75, icon check xanh
  if (status === "PAID") {
    return (
      <div
        className={cn(
          "bg-white rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden opacity-75",
          className,
        )}
      >
        <div className="px-4 py-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-12 h-12 rounded-[20px] bg-[#E6F4EA] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#137333]" />
            </div>

            {/* Title + Status */}
            <div className="flex-1 min-w-0 flex gap-1.5 flex-col">
              <h3 className="text-[14px] font-semibold text-[#251915] leading-[20px] truncate">
                {period}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex px-2 py-0.5 bg-[#E6F4EA] rounded-[20px]">
                  <span className="text-[12px] font-bold tracking-[0.05em] text-[#137333] leading-[16px]">
                    {label}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#FBE3DD] mt-3 pt-3 flex items-center justify-between">
            <p className="text-[14px] font-semibold text-[#58413C] leading-[20px]">{amount}</p>
            <div className="flex items-center justify-center">
              <ChevronRight className="w-[7.4px] h-3 text-[#595C5E]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card nháp / đã hủy: mờ, badge xám
  const isDraft = status === "DRAFT";
  return (
    <div
      className={cn(
        "bg-white rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden opacity-75",
        className,
      )}
    >
      <div className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-[20px] bg-[#EEE9E7] flex items-center justify-center shrink-0">
            {isDraft ? (
              <FileText className="w-5 h-5 text-[#8A7D78]" />
            ) : (
              <XCircle className="w-5 h-5 text-[#8A7D78]" />
            )}
          </div>

            {/* Title + Status */}
            <div className="flex-1 min-w-0 flex gap-1.5 flex-col">
              <h3 className="text-[14px] font-semibold text-[#251915] leading-[20px] truncate">
                {period}
              </h3>
              <div className="flex items-center gap-2">
                <span className="inline-flex px-2 py-0.5 bg-[#EEE9E7] rounded-[20px]">
                  <span className="text-[12px] font-bold tracking-[0.05em] text-[#8A7D78] leading-[16px]">
                    {label}
                  </span>
                </span>
                {!isDraft && (
                  <span className="text-[14px] font-medium tracking-[0.02em] text-[#58413C] leading-[18px]">
                    Hạn: {dueDate}
                  </span>
                )}
              </div>
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F0E6E2] mt-3 pt-3 flex items-center justify-between">
          <p className="text-[14px] font-semibold text-[#58413C] leading-[20px]">{amount}</p>
          <div className="flex items-center justify-center">
            <ChevronRight className="w-[7.4px] h-3 text-[#595C5E]" />
          </div>
        </div>
      </div>
    </div>
  );
}