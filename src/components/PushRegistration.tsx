"use client";

import { usePushSubscription } from "@/hooks/usePushSubscription";

type PushRegistrationProps = {
  compact?: boolean;
  variant?: "card" | "switch";
};

export function PushRegistration({ compact = false, variant = "card" }: PushRegistrationProps) {
  const { state, enable, disable } = usePushSubscription();
  const busy = state === "loading";
  const checked = state === "enabled";

  if (variant === "switch") {
    const status = busy
      ? "Đang kiểm tra..."
      : checked
        ? "Đã bật thông báo đẩy"
        : state === "denied"
          ? "Thông báo đẩy đã bị từ chối trong cài đặt trình duyệt"
          : state === "unsupported"
            ? "Trình duyệt hoặc môi trường hiện tại chưa hỗ trợ thông báo đẩy"
            : state === "error"
              ? "Không thể cập nhật thông báo đẩy. Vui lòng thử lại."
              : "Đang tắt thông báo đẩy";
    return (
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-[#6B7280]" aria-live="polite">{status}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={checked ? "Tắt thông báo đẩy" : "Bật thông báo đẩy"}
          disabled={busy || state === "denied" || state === "unsupported"}
          onClick={() => void (checked ? disable() : enable())}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-[#0759D6]" : "bg-[#D8D0CC]"}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-[left] ${checked ? "left-6" : "left-1"}`} />
        </button>
      </div>
    );
  }

  if (busy) return <p className="text-xs text-[#6B7280]">Đang kiểm tra...</p>;
  if (checked)
    return compact ? (
      <button type="button" onClick={() => void disable()} className="relative h-6 w-11 rounded-full bg-[#0759D6]" aria-label="Tắt thông báo">
        <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
      </button>
    ) : (
      <div className="flex items-center gap-2 text-xs text-green-700"><span>Đã bật thông báo đẩy</span><button type="button" onClick={() => void disable()} className="text-[#0051D5]">Tắt</button></div>
    );
  if (state === "denied") return <p className="text-xs text-[#6B7280]">Thông báo đẩy đã bị từ chối trong cài đặt trình duyệt</p>;
  if (state === "unsupported") return <p className="text-xs text-[#6B7280]">Trình duyệt hoặc môi trường hiện tại chưa hỗ trợ thông báo đẩy</p>;
  if (state === "error") return <p className="text-xs text-[#6B7280]">Không thể cập nhật thông báo đẩy. Vui lòng thử lại.</p>;
  return compact ? (
    <button type="button" onClick={() => void enable()} className="relative h-6 w-11 rounded-full bg-[#D8D0CC]" aria-label="Bật thông báo">
      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
    </button>
  ) : <button type="button" onClick={() => void enable()} className="text-sm text-[#0051D5]">Bật thông báo đẩy</button>;
}
