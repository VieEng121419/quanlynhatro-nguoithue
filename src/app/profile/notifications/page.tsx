"use client";

import Link from "next/link";
import { ArrowLeft, BellRing } from "lucide-react";
import { PushRegistration } from "@/components/PushRegistration";

export default function NotificationSettingsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-[72px] pb-[30px] bg-[#FFF8F6]">
      <div className="max-w-[650px] mx-auto px-4">
        <div className="flex items-center gap-3 pt-6">
          <Link
            href="/profile"
            aria-label="Quay lại trang cá nhân"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#604D47] transition-colors hover:bg-black/[0.04] active:bg-black/[0.08]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-[20px] font-bold text-[#251915]">Thông báo</h1>
        </div>

        <section className="mt-8 overflow-hidden rounded-[28px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[#FBE3DD]">
              <BellRing className="h-6 w-6 text-[#A73414]" strokeWidth={1.5} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-semibold text-[#27211F]">Thông báo đẩy</h2>
              <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">
                Nhận thông báo push cho hóa đơn và giao dịch mới.
              </p>
            </div>
          </div>
          <div className="border-t border-[#3A3A3A]/[0.06] px-5 py-4 sm:px-6">
            <PushRegistration variant="switch" />
          </div>
        </section>
      </div>
    </div>
  );
}
