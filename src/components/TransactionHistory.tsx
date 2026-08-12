"use client";

import { Receipt, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export type TransactionType = "rent" | "utility";
export type TransactionStatus = "PAID" | "PARTIAL" | "UNPAID";

export interface Transaction {
  id: number;
  type: TransactionType;
  title: string;
  date: string;
  amount: number;
  status: TransactionStatus;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  className?: string;
}

export function TransactionHistory({
  transactions,
  className,
}: TransactionHistoryProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-t-[20px] shadow-[0px_1px_4px_rgba(0,0,0,0.08)] overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h2 className="text-base font-bold text-[#251915]">
          Lịch sử giao dịch gần đây
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-[#A73414] hover:text-[#8A2A10] transition-colors"
        >
          Xem tất cả
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-[#F0E6E2]" />

      {/* Transaction List */}
      <ul className="divide-y divide-[#F0E6E2]">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center gap-3 px-4 py-3">
            {/* Icon */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                tx.type === "rent"
                  ? "bg-[#FFE9E4] text-[#A73414]"
                  : "bg-[#E8F0FF] text-[#0051D5]"
              )}
            >
              {tx.type === "rent" ? (
                <Receipt className="w-5 h-5" />
              ) : (
                <Archive className="w-5 h-5" />
              )}
            </div>

            {/* Middle: Title + Date */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#251915] truncate">
                {tx.title}
              </p>
              <p className="text-xs text-[#58413C] mt-0.5">{tx.date}</p>
            </div>

            {/* Right: Amount + Status */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-[#251915]">
                {tx.status === "PAID" && "-"}
                {tx.status === "PARTIAL" && "~"}
                {tx.status === "UNPAID" && "+"}
                {tx.amount.toLocaleString("vi-VN")} đ
              </p>
              <p className="text-xs text-[#58413C] mt-0.5">
                {tx.status === "PAID" && "Đã thanh toán"}
                {tx.status === "PARTIAL" && "Chưa thanh toán đủ"}
                {tx.status === "UNPAID" && "Chưa thanh toán"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}