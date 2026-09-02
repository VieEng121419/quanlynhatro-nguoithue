"use client";
import Link from "next/link";
import { useNotifications } from "@/hooks/useNotifications";
import { PushRegistration } from "@/components/PushRegistration";

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, read, readAll } =
    useNotifications();
  return (
    <main className="min-h-screen mt-[72px] p-4 max-w-[390px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">
            Thông báo{" "}
            {unreadCount > 0 && (
              <span className="text-sm text-[#A73414]">
                ({unreadCount} chưa đọc)
              </span>
            )}
          </h1>
          <PushRegistration />
        </div>
        <button
          type="button"
          onClick={() => readAll()}
          className="text-sm text-[#0051D5]"
        >
          Đọc tất cả
        </button>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : notifications.length === 0 ? (
        <p className="text-[#6B7280]">Chưa có thông báo</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl p-4 ${
                item.isRead ? "bg-white" : "bg-[#FBE3DD]"
              }`}
            >
              <button
                type="button"
                onClick={() => !item.isRead && read(item.id)}
                className="text-left w-full"
              >
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm mt-1">{item.message}</p>
                <p className="text-xs text-[#6B7280] mt-2">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </p>
              </button>
              {item.referenceId && (
                <Link
                  className="text-sm text-[#0051D5] inline-block mt-2"
                  href={`/invoices?invoiceId=${item.referenceId}`}
                >
                  Xem hóa đơn
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
