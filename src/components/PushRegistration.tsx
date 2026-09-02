"use client";
import { useState } from "react";
import { apiClient } from "@/lib/api";

export function PushRegistration() {
  const [state, setState] = useState<
    "idle" | "enabled" | "denied" | "unsupported"
  >("idle");
  const enable = async () => {
    debugger;
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (
      !key ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setState("denied");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      });
      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth)
        throw new Error("invalid subscription");
      await apiClient.post("/notification/push-subscriptions", {
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      });
      setState("enabled");
    } catch {
      setState("unsupported");
    }
  };
  if (state === "enabled")
    return <p className="text-xs text-green-700">Đã bật thông báo đẩy</p>;
  if (state === "denied")
    return (
      <p className="text-xs text-[#6B7280]">
        Thông báo đẩy đã bị từ chối trong cài đặt trình duyệt
      </p>
    );
  if (state === "unsupported")
    return (
      <p className="text-xs text-[#6B7280]">
        Trình duyệt chưa hỗ trợ thông báo đẩy
      </p>
    );
  return (
    <button
      type="button"
      onClick={() => void enable()}
      className="text-sm text-[#0051D5]"
    >
      Bật thông báo đẩy
    </button>
  );
}
