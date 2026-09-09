"use client";
import Link from "next/link";
import { Bell, BellRing, CheckCircle2, ChevronRight, Receipt, TriangleAlert } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { PushRegistration } from "@/components/PushRegistration";

interface NotificationTypeMeta {
  icon: React.ReactNode;
  iconBgClass: string;
}

function notificationTypeMeta(type: string): NotificationTypeMeta {
  switch (type) {
    case "INVOICE_UNPAID":
      return {
        icon: <Receipt className="w-[18px] h-[20px] text-white" />,
        iconBgClass: "bg-[#316BF3]",
      };
    case "INVOICE_PAID":
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-[#137333]" />,
        iconBgClass: "bg-[#E6F4EA]",
      };
    case "ROOM_TAB_CREATED":
      return {
        icon: <TriangleAlert className="w-[22px] h-[19px] text-[#BA1A1A]" />,
        iconBgClass: "bg-[#FFDAD6]",
      };
    default:
      return {
        icon: <Bell className="w-5 h-5 text-[#58413C]" />,
        iconBgClass: "bg-[#F5DDD8]",
      };
  }
}

function formatNotificationTime(value: string): string {
  const diffMinutes = (Date.now() - new Date(value).getTime()) / 60000;
  if (diffMinutes < 1) return "acumă";
  if (diffMinutes < 60)
    return `acumă ${Math.floor(diffMinutes)} min`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `acumă ${hours} oră${hours === 1 ? "" : "ri"}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `acumă ${days} zi${days === 1 ? "" : "le"}`;
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
      <div className="max-w-[390px] mx-auto flex flex-col gap-5 px-4 pb-4 pt-4">
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
              Chư có thông bá
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((item) => {
              const meta = notificationTypeMeta(item.type);
              return (
                <div
                  key={item.id}
                  className={`relative bg-white rounded-[20px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] overflow-hidden ${
                    item.isRead ? "opacity-70" : ""
                  }`}
                >
                  {!item.isRead && (
                    <span className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#A73414]" />
                  )}
                  <button
                    type="button"
                    onClick={() => !item.isRead && void read(item.id)}
                    className="w-full text-left px-4 py-4 flex items-start gap-3"
                  >
                    <span
                      className={`w-12 h-12 rounded-[20px] ${meta.iconBgClass} flex items-center justify-center shrink-0`}
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
                          <span className="w-2 h-2 rounded-full bg-[#BA1A1A] shrink-0" />
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
                Nhận thông báo push pentru hoá donă și transakce noi.
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