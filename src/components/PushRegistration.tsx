"use client";
import { useState } from "react";
import { apiClient } from "@/lib/api";

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushRegistration() {
  const [state, setState] = useState<
    "idle" | "enabled" | "denied" | "unsupported" | "error"
  >("idle");
  const enable = async () => {
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
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
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
      setState("error");
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
        Trình duyệt hoặc môi trường hiện tại chưa hỗ trợ thông báo đẩy
      </p>
    );
  if (state === "error")
    return (
      <p className="text-xs text-[#6B7280]">
        Không thể bật thông báo đẩy. Vui lòng thử lại.
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
