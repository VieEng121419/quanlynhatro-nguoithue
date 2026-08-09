"use client";

import { useMyRoom } from "@/hooks/useMyRoom";

export default function HomePage() {
  const { room, loading, error } = useMyRoom();

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
      }>;
    }>;
  } | null;

  const contract = roomData?.contracts?.[0];
  const latestInvoice = contract?.invoices?.[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-[390px] mx-auto flex flex-col gap-4">
        <h1 className="text-[22px] font-bold text-[#A73414]">
          Phòng {roomData?.roomNumber}
        </h1>

        {contract && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-base font-semibold text-[#251915]">
              Hợp đồng
            </h2>
            <p className="text-sm text-[#58413C] mt-2">
              Người thuê: {contract.tenantName}
            </p>
            <p className="text-sm text-[#58413C]">
              Giá phòng: {Number(contract.rentPrice).toLocaleString("vi-VN")}đ
            </p>
            <p className="text-sm text-[#58413C]">
              Bắt đầu: {new Date(contract.startDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        )}

        {latestInvoice && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-base font-semibold text-[#251915]">
              Hoá đơn mới nhất
            </h2>
            <p className="text-sm text-[#58413C] mt-2">
              Kỳ: {new Date(latestInvoice.fromDate).toLocaleDateString("vi-VN")} -{" "}
              {new Date(latestInvoice.toDate).toLocaleDateString("vi-VN")}
            </p>
            <p className="text-sm text-[#58413C]">
              Tổng: {Number(latestInvoice.totalAmount).toLocaleString("vi-VN")}đ
            </p>
            <p className="text-sm text-[#58413C]">
              Trạng thái: {latestInvoice.status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}