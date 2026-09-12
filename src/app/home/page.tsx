"use client";

import { useEffect } from "react";
import { useMyRoom } from "@/hooks/useMyRoom";
import { DebtAlert } from "@/components/ui/debt-alert";
import { UtilityInfo } from "@/components/UtilityInfo";
import { TransactionHistory } from "@/components/TransactionHistory";
import { BellRing } from "lucide-react";
import { PushRegistration } from "@/components/PushRegistration";

export default function HomePage() {
  const { room, loading, error } = useMyRoom();

  useEffect(() => {
    if (loading || error || !("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // Push registration is optional and must not block the home page.
    });
  }, [loading, error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-lg text-[#6B7280]">Đang tải thông tin phòng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <p className="text-lg text-red-600 text-center">{error}</p>
      </div>
    );
  }

  const roomData = room as {
    id: number;
    roomNumber: string;
    status: string;
    contracts?: Array<{
      id: number;
      tenantName: string;
      rentPrice: string;
      startDate: string;
      endDate?: string | null;
      invoices?: Array<{
        id: number;
        totalAmount: string;
        status: string;
        fromDate: string;
        toDate: string;
        serviceAmount: number;
      }>;
    }>;
  } | null;

  const contract = roomData?.contracts?.[0];
  const latestInvoice = contract?.invoices?.[0];
  const hasDebt = latestInvoice?.status !== "UNPAID";
  const serviceAmount = latestInvoice ? Number(latestInvoice.serviceAmount) : 0;
  const electricityUsage = 120;
  const waterUsage = 8;
  const transactions = [
    {
      id: 1,
      type: "rent" as const,
      title: "Tiền phòng Tháng 9",
      date: "01/09/2023",
      amount: 3500000,
      status: "PARTIAL" as const,
    },
    {
      id: 2,
      type: "utility" as const,
      title: "Vợ 1 chai sting",
      date: "05/08/2023",
      amount: 10000,
      status: "UNPAID" as const,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] mt-[72px]">
      <div className="max-w-[390px] mx-auto flex flex-col gap-4 p-4">
        {hasDebt && latestInvoice && (
          <DebtAlert>
            Bạn còn nợ{" "}
            {Number(latestInvoice.totalAmount).toLocaleString("vi-VN")} VNĐ, hạn
            chót {new Date(latestInvoice.toDate).toLocaleDateString("vi-VN")}.
          </DebtAlert>
        )}

        <section className="overflow-hidden rounded-[20px] bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-[#FBE3DD]">
              <BellRing className="h-5 w-5 text-[#A73414]" strokeWidth={1.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-[#251915]">
                Thông báo đẩy
              </p>
              <p className="mt-0.5 text-[12px] text-[#6B7280]">
                Nhận thông báo push cho hóa đơn và giao dịch mới.
              </p>
            </div>
          </div>
          <div className="px-4 py-3">
            <PushRegistration />
          </div>
        </section>

        <UtilityInfo
          electricityUsage={electricityUsage}
          waterUsage={waterUsage}
          serviceAmount={serviceAmount}
        />

        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}
