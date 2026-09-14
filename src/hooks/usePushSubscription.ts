"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api";

type PushState = "loading" | "idle" | "enabled" | "denied" | "unsupported" | "error";

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function saveSubscription(subscription: PushSubscription) {
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) throw new Error("invalid subscription");
  await apiClient.post("/notification/push-subscriptions", {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  });
}

export function usePushSubscription() {
  const [state, setState] = useState<PushState>("loading");
  const operationRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setState("unsupported");
        return;
      }
      try {
        const registration = await navigator.serviceWorker.getRegistration("/");
        const subscription = registration ? await registration.pushManager.getSubscription() : null;
        if (!subscription) {
          if (!cancelled) setState("idle");
          return;
        }
        await saveSubscription(subscription);
        if (!cancelled) setState("enabled");
      } catch {
        if (!cancelled) setState("error");
      }
    };
    void hydrate();
    return () => { cancelled = true; };
  }, []);

  const enable = useCallback(async () => {
    const operation = ++operationRef.current;
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!key || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    try {
      const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      if (permission !== "granted") {
        if (operation === operationRef.current) setState("denied");
        return;
      }
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
      await saveSubscription(subscription);
      if (operation === operationRef.current) setState("enabled");
    } catch {
      if (operation === operationRef.current) setState("error");
    }
  }, []);

  const disable = useCallback(async () => {
    const operation = ++operationRef.current;
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await apiClient.delete("/notification/push-subscriptions", { data: { endpoint: subscription.endpoint } });
        await subscription.unsubscribe();
      }
      if (operation === operationRef.current) setState("idle");
    } catch {
      if (operation === operationRef.current) setState("error");
    }
  }, []);

  return { state, enable, disable };
}
