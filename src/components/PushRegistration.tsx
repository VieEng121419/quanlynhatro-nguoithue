"use client";
import { useEffect, useRef, useState } from "react";
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
    "loading" | "idle" | "enabled" | "denied" | "unsupported" | "error"
  >("loading");
  const operationRef = useRef(0);

  const saveSubscription = async (subscription: PushSubscription) => {
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth)
      throw new Error("invalid subscription");
    await apiClient.post("/notification/push-subscriptions", {
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    });
  };

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const operation = operationRef.current;
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setState("unsupported");
        return;
      }
      try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      if (!registration) {
        if (!cancelled) setState("idle");
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        if (!cancelled) setState("idle");
        return;
      }
      if (cancelled || operation !== operationRef.current) return;

      await saveSubscription(subscription);
      if (!cancelled && operation === operationRef.current) setState("enabled");
      } catch {
        if (!cancelled) setState("error");
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const disable = async () => {
    const operation = ++operationRef.current;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await apiClient.delete("/notification/push-subscriptions", {
          data: { endpoint: subscription.endpoint },
        });
        await subscription.unsubscribe();
      }
      if (operation === operationRef.current) setState("idle");
    } catch {
      if (operation === operationRef.current) setState("error");
    }
  };

  const enable = async () => {
    const operation = ++operationRef.current;
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (
      !key ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      if (operation === operationRef.current) setState("unsupported");
      return;
    }
    const permission =
      Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();
    if (permission !== "granted") {
      if (operation === operationRef.current) setState("denied");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key),
        }));
      await saveSubscription(subscription);
      if (operation === operationRef.current) setState("enabled");
    } catch {
      if (operation === operationRef.current) setState("error");
    }
  };
  if (state === "loading")
    return <p className="text-xs text-[#6B7280]">Đang kiểm tra...</p>;
  if (state === "enabled")
    return (
      <div className="flex items-center gap-2 text-xs text-green-700">
        <span>Đã bật thông báo đẩy</span>
        <button
          type="button"
          onClick={() => void disable()}
          className="text-[#0051D5]"
        >
          Tắt
        </button>
      </div>
    );
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
