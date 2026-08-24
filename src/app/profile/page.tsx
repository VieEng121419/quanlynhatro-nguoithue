"use client";

import { useRouter } from "next/navigation";
import {
  FileText,
  History,
  Bell,
  CircleHelp,
  LogOut,
  MonitorSmartphone,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  danger?: boolean;
  onClick?: () => void;
}

function MenuRow({ icon, label, badge, danger, onClick }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center w-full h-[55px] px-[26px] transition-colors hover:bg-black/[0.03] active:bg-black/[0.06]"
    >
      {/* Icon */}
      <span className="shrink-0 text-[#0759D6]">{icon}</span>

      {/* Label */}
        <span className="flex-1 text-left ml-4">
          <span className="text-[14px] font-semibold text-[#27211F]">
            {label}
          </span>
        </span>

        {/* Badge Thông báo */}
        {badge != null && (
          <span className="ml-2 shrink-0">
            <span className="flex items-center justify-center min-w-[38px] h-[38px] rounded-full bg-[#C91C20] px-2">
              <span className="text-white text-[14px] font-bold">{badge}</span>
            </span>
          </span>
        )}

      {/* Chevron */}
      {danger ? (
        <LogOut className="w-[28px] h-[28px] text-[#C0392B]" />
      ) : (
        <ChevronRight className="w-[28px] h-[28px] text-[#7A6F6A]" />
      )}
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogoutAll = () => {
    // TODO: xác nhận modal rồi gọi API đăng xuất toàn bộ thiết bị
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-[72px] pb-[30px] bg-[#FFF8F6]">
      <div className="max-w-[650px] mx-auto px-[26px] flex flex-col">
        {/* Khu vực phía trên */}
        <div className="flex flex-col items-center text-center pt-[55px]">
          {/* Avatar */}
          <div className="w-[160px] h-[160px] rounded-[32px] bg-[#A73414]/[0.08] flex items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full bg-[#5B5B5B] flex items-center justify-center">
              <span className="text-white text-[52px] font-semibold tracking-tight">
                TV
              </span>
            </div>
          </div>

          {/* Tên người dùng */}
          <h1 className="mt-[30px] text-[14px] font-bold text-[#27211F] text-center leading-tight">
            {user?.fullName || "Nguyễn Văn A"}
          </h1>

          {/* Số điện thoại (hard data) */}
          <p className="mt-[5px] text-[14px] font-normal text-[#604D47] text-center">
            0901 234 567
          </p>
        </div>

        {/* Card menu chính */}
        <div className="w-full mt-[55px]">
          <div className="bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <MenuRow
              icon={<FileText className="w-[24px] h-[24px]" strokeWidth={1.5} />}
              label="Hợp đồng của tôi"
              onClick={() => router.push("/contracts")}
            />
            <div className="h-[1px] bg-[#3A3A3A]/[0.06]" />

            <MenuRow
              icon={<History className="w-[24px] h-[24px]" strokeWidth={1.5} />}
              label="Lịch sử thanh toán"
              onClick={() => router.push("/payments")}
            />
            <div className="h-[1px] bg-[#3A3A3A]/[0.06]" />

            <MenuRow
              icon={<Bell className="w-[24px] h-[24px]" strokeWidth={1.5} />}
              label="Thông báo"
              badge={3}
              onClick={() => {}}
            />
            <div className="h-[1px] bg-[#3A3A3A]/[0.06]" />

            <MenuRow
              icon={<CircleHelp className="w-[24px] h-[24px]" strokeWidth={1.5} />}
              label="Hỗ trợ"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Card logout */}
        <div className="w-full mt-[55px]">
          <div className="bg-white rounded-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <MenuRow
              danger
              icon={<MonitorSmartphone className="w-[24px] h-[24px]" strokeWidth={1.5} />}
              label="Đăng xuất khỏi mọi thiết bị"
              onClick={handleLogoutAll}
            />
            <div className="h-[1px] bg-[#3A3A3A]/[0.06]" />

            <MenuRow
              danger
              icon={<LogOut className="w-[24px] h-[24px]" strokeWidth={1.5} />}
              label="Đăng xuất"
              onClick={handleLogout}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-[55px] mb-[30px] text-center">
          <p className="text-[14px] font-normal text-[#7A726F]">
            Phiên bản 1.0 – Nha Trọ 24h
          </p>
        </footer>
      </div>
    </div>
  );
}