"use client";

import { QrCode, TriangleAlert } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="h-screen bg-[#FFF8F6] flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] h-full bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] p-6">
        {/* Header Section */}
        <div className="pb-6">
          <h1 className="text-[22px] font-bold text-[#A73414] text-center">
            Nhà Trọ Tuấn Việt
          </h1>
          <h2 className="text-[20px] font-semibold text-[#251915] text-center pt-2">
            Chào mừng
          </h2>
          <p className="text-base text-[#58413C] text-center mt-2">
            Quét mã QR được cung cấp để truy cập
            <br />
            thông tin phòng của bạn.
          </p>
        </div>

        {/* QR Scanner Area */}
        <div className="py-4 flex flex-col items-center gap-4">
          {/* Scan Button */}
          <button
            type="button"
            className="w-[280px] flex flex-col items-center justify-center py-[86px] bg-[#FFF1ED] border-4 border-dashed border-[#A73414] rounded-[20px] cursor-pointer hover:bg-[#FFE4DB] transition-colors"
          >
            <div className="pb-4">
              <QrCode className="w-[53.33px] h-[53.33px] text-[#A73414]" />
            </div>
            <span className="text-base font-semibold text-[#A73414]">
              Nhấn để quét mã QR
            </span>
          </button>

          {/* Manual Entry Link */}
          <div className="pt-2">
            <button
              type="button"
              className="text-base font-semibold text-[#0051D5] underline px-4 py-3 rounded cursor-pointer hover:opacity-80 transition-opacity"
            >
              Nhập mã thủ công
            </button>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="flex items-start gap-3 p-4 bg-[#FEF08A] border-l-4 border-[#CA8A04] rounded-[20px]">
          <div className="pt-0.5 shrink-0">
            <TriangleAlert className="w-[22px] h-[19px] text-[#CA8A04]" />
          </div>
          <p className="text-base font-medium text-[#854D0E]">
            Mã QR này chỉ dành cho riêng
            <br />
            bạn. Vui lòng không chia sẻ.
          </p>
        </div>
      </div>
    </div>
  );
}