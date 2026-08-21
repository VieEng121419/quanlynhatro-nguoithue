"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";

import { CardAlert } from "@/components/ui/card-alert";
import { QrScanner } from "@/components/QrScanner";
import { useQrLogin } from "@/hooks/useQrLogin";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { login: qrLogin, loading, error } = useQrLogin();
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);

  const handleLogin = useCallback(
    async (qrCode: string) => {
      const result = await qrLogin(qrCode);
      if (result) {
        login(result.accessToken, result.user);
        router.push("/home");
      }
    },
    [qrLogin, login, router],
  );

  const handleScan = useCallback(
    (qrCode: string) => {
      setShowScanner(false);
      handleLogin(qrCode);
    },
    [handleLogin],
  );

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (manualCode.trim()) {
        handleLogin(manualCode.trim());
      }
    },
    [manualCode, handleLogin],
  );

  return (
    <div className="h-screen bg-[#FFF8F6] flex items-center justify-center p-4">
      <div className="w-full flex justify-center items-center max-w-[390px] h-fit bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] p-6">
        <div className="flex flex-col gap-2 justify-center pb-6">
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
              onClick={() => setShowScanner(true)}
              disabled={loading}
              className="w-[280px] flex flex-col items-center justify-center py-[86px] bg-[#FFF1ED] border-4 border-dashed border-[#A73414] rounded-[20px] cursor-pointer hover:bg-[#FFE4DB] transition-colors disabled:opacity-50"
            >
              <div className="pb-4">
                <QrCode className="w-[53.33px] h-[53.33px] text-[#A73414]" />
              </div>
              <span className="text-base font-semibold text-[#A73414]">
                {loading ? "Đang xử lý..." : "Nhấn để quét mã QR"}
              </span>
            </button>

            {/* Manual Entry Link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowManual((prev) => !prev)}
                className="text-base font-semibold text-[#0051D5] underline px-4 py-3 rounded cursor-pointer hover:opacity-80 transition-opacity"
              >
                Nhập mã thủ công
              </button>
            </div>

            {/* Manual Entry Form */}
            {showManual && (
              <form
                onSubmit={handleManualSubmit}
                className="w-full flex flex-col gap-3"
              >
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Nhập mã phòng (vd: 101)"
                  className="w-full px-4 py-3 border border-[#A73414]/30 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#A73414]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#A73414] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </form>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-sm font-medium text-red-600 text-center">
                {error}
              </p>
            )}
          </div>

          {/* Warning Alert */}
          <CardAlert>
            Mã QR này chỉ dành cho riêng
            <br />
            bạn. Vui lòng không chia sẻ.
          </CardAlert>
        </div>
      </div>

      {/* QR Scanner Overlay */}
      {showScanner && (
        <QrScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}