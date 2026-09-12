import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export type NotificationType =
  | "rent"
  | "trans_successful"
  | "utility"
  | "general";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: number | null;
  isRead: boolean;
  createdAt: string;
}

/** Maps persisted backend event types and legacy display types to the tenant UI contract. */
export function mapNotificationType(type: string): NotificationType {
  switch (type) {
    case "INVOICE_UNPAID":
    case "rent":
      return "rent";
    case "INVOICE_PAID":
    case "trans_successful":
      return "trans_successful";
    case "ROOM_TAB_CREATED":
    case "utility":
      return "utility";
    case "general":
      return "general";
    default:
      return "general";
  }
}

function normalizeNotification(item: Omit<NotificationItem, "type"> & { type: string }): NotificationItem {
  return { ...item, type: mapNotificationType(item.type) };
}
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const { data } = await apiClient.get<{
        notifications: NotificationItem[];
        unreadCount: number;
      }>("/notification");
      setNotifications(data.notifications.map(normalizeNotification));
      setUnreadCount(data.unreadCount);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh().catch(() => setLoading(false));

    const handleFocus = () => {
      void refresh();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };
    const intervalId = window.setInterval(() => {
      void refresh();
    }, 30000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);
  const read = async (id: number) => {
    await apiClient.patch(`/notification/${id}/read`);
    await refresh();
  };
  const readAll = async () => {
    await apiClient.patch("/notification/read-all");
    await refresh();
  };
  return { notifications, unreadCount, loading, refresh, read, readAll };
}
