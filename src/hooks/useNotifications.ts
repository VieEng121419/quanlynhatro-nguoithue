import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  referenceId?: number | null;
  isRead: boolean;
  createdAt: string;
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
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh().catch(() => setLoading(false));
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
