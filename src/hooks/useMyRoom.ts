import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

export function useMyRoom() {
  const [room, setRoom] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ data: unknown }>("/room/my-room");
      setRoom(data.data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Không thể lấy thông tin phòng!";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  return { room, loading, error, refetch: fetchRoom };
}