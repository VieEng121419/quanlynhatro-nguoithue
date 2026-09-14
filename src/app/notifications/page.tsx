"use client";
import Link from "next/link";
import {
  Bell,
  BellRing,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Receipt,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { PushRegistration } from "@/components/PushRegistration";

interface NotificationTypeMeta {
  color: string;
  backgroundColor?: string;
  icon: React.ReactNode;
}

function notificationTypeMeta(type: string): NotificationTypeMeta {
  switch (type) {
    case "rent":
      return {
        color: "#A73414",
        backgroundColor: "#FFDBD2",
        icon: <Receipt className={`h-5 w-5 text-[#A73414]`} />,
      };
    case "utility":
      return {
        color: "#0051D5",
        backgroundColor: "#DBE1FF",
        icon: <CircleDollarSign className={`h-5 w-5 text-[#0051D5] font-medium`} />,
      };
    case "trans_successful":
      return {
        color: "#219653",
        backgroundColor: "#C8FACD",
        icon: <CheckCircle2 className={`h-5 w-5 text-[#219653]`} />,
      };
    case "general":
    default:
      return {
        color: "#595C5E",
        backgroundColor: "#E0E3E5",
        icon: <Bell className={`h-5 w-5 text-[#595C5E]`} />,
      };
  }
}

function formatNotificationTime(value: string): string {
  const diffMinutes = (Date.now() - new Date(value).getTime()) / 60000;
  if (diffMinutes < 1) return "vừa xong";
  if (diffMinutes < 60) return `${Math.floor(diffMinutes)} phút trước`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, read, readAll } =
    useNotifications();

  return (
    <div className="min-h-[calc(100vh-4rem)] mt-[72px]">
      <div className="max-w-[768px] mx-auto flex flex-col gap-5 px-4 pb-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-[20px] font-bold text-[#251915]">
            Thông báo
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#A73414] text-white text-[12px] font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => void readAll()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[20px] bg-[#0051D5] text-white text-[13px] font-semibold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors active:bg-[#0043B3]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Đọc tất cả
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-lg text-[#6B7280]">
              Đang tải...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <span className="w-16 h-16 rounded-[24px] bg-[#FBE3DD] flex items-center justify-center">
              <Bell className="w-7 h-7 text-[#A73414]" strokeWidth={1.5} />
            </span>
            <p className="text-[16px] font-semibold text-[#251915]">
              Chưa có thông báo
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((item) => {
              const meta = notificationTypeMeta(item.type);
              return (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-[20px] bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.08)] ${
                    item.isRead ? "opacity-70" : ""
                  }`}
                >
                  {!item.isRead && (
                    <span
                      className="absolute bottom-0 left-0 top-0 w-[4px]"
                      style={{ backgroundColor: meta.color }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => !item.isRead && void read(item.id)}
                    className="w-full text-left px-4 py-4 flex items-start gap-3"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px]"
                      style={{ backgroundColor: meta.backgroundColor }}
                    >
                      {meta.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className={`flex items-center gap-1.5 text-[14px] leading-[20px] ${
                          item.isRead
                            ? "text-[#58413C] font-medium"
                            : "text-[#251915] font-bold"
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {!item.isRead && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: meta.color }}
                          />
                        )}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-[18px] text-[#58413C] line-clamp-2">
                        {item.message}
                      </span>
                      <span className="mt-1.5 block text-[12px] text-[#6B7280]">
                        {formatNotificationTime(item.createdAt)}
                      </span>
                    </span>
                  </button>
                  {item.referenceId && (
                    <Link
                      className="flex items-center gap-1 px-4 pb-3 pt-1 text-[13px] font-semibold text-[#0051D5]"
                      href={`/invoices?invoiceId=${item.referenceId}`}
                    >
                      Xem hóa đơn
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Push settings */}
        <section className="bg-white rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-12 h-12 rounded-[20px] bg-[#FBE3DD] flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-[#A73414]" strokeWidth={1.5} />
            </span>
            <div className="flex-1 min-w-0">
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
      </div>
    </div>
  );
}