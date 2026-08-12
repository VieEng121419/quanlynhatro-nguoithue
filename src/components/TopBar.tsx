"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  /** Tên người dùng hiển thị. Mặc định lấy từ useAuth. */
  userName?: string;
  /** URL ảnh đại diện. */
  avatarUrl?: string;
  /** Số thông báo chưa đọc. Lớn hơn 0 sẽ hiển thị badge. */
  unreadCount?: number;
  /** Sự kiện khi bấm nút thông báo. */
  onNotificationClick?: () => void;
}

export function TopBar({
  userName,
  avatarUrl,
  unreadCount = 0,
  onNotificationClick,
}: TopBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === "/login") {
    return null;
  }

  const name = userName ?? user?.fullName ?? "Người thuê";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[72px] bg-[#FFF8F6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="max-w-[390px] h-full mx-auto px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-[#E0BFB7]">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-[#A73414] text-white text-sm font-semibold">
            {initials || "N"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-[15px] font-semibold leading-[28px] text-[#251915]">
          Chào, {name}
        </h1>
      </div>

      <button
        type="button"
        onClick={onNotificationClick}
        aria-label="Thông báo"
        aria-haspopup="true"
        className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
      >
        <Bell className="w-4 h-5 text-[#251915]" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#BA1A1A] border-2 border-[#FFF8F6]" />
        )}
      </button>
      </div>
    </header>
  );
}