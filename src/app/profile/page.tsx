"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-[390px] mx-auto flex flex-col gap-4">
        <h1 className="text-[22px] font-bold text-[#A73414]">Cá nhân</h1>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-base font-semibold text-[#251915]">
            Thông tin tài khoản
          </h2>
          <p className="text-sm text-[#58413C] mt-2">
            Họ tên: {user?.fullName || "—"}
          </p>
          <p className="text-sm text-[#58413C]">
            Tên đăng nhập: {user?.userName || "—"}
          </p>
          <p className="text-sm text-[#58413C]">
            Vai trò: {user?.role || "—"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}