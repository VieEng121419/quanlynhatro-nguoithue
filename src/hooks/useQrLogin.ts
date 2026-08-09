import { useState } from "react";
import { apiClient } from "@/lib/api";

export interface QrLoginResponse {
  accessToken: string;
  user: {
    id: number;
    userName: string;
    fullName: string;
    role: string;
  };
}

export function useQrLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (roomCode: string): Promise<QrLoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post<{ data: QrLoginResponse }>(
        "/auth/qr-login",
        { roomCode },
      );
      return data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Đăng nhập bằng mã QR thất bại!";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}