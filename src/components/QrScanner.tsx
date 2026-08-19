"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { X, RefreshCw } from "lucide-react";

interface QrScannerProps {
  onScan: (roomCode: string) => void;
  onClose: () => void;
}

export function QrScanner({ onScan, onClose }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const stoppingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Luôn dùng onScan mới nhất mà không restart scanner
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner || stoppingRef.current) return;

    // Chỉ dừng nếu scanner đang chạy hoặc đang tạm dừng
    const state = scanner.getState();
    if (state !== Html5QrcodeScannerState.SCANNING && state !== Html5QrcodeScannerState.PAUSED) {
      return;
    }

    stoppingRef.current = true;
    try {
      await scanner.stop();
      await scanner.clear();
    } catch {
      // Bỏ qua lỗi nếu scanner đã dừng
    } finally {
      stoppingRef.current = false;
    }
  }, []);

  const startScannerWithConfig = useCallback(
    (config: { facingMode?: string; deviceId?: { exact: string } }) => {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      return scanner.start(
        config,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Dừng scanner sau khi quét được để tránh quét lặp
          stopScanner();
          onScanRef.current(decodedText);
        },
        () => {
          // ignore per-frame errors
        },
      );
    },
    [stopScanner],
  );

  const startScanner = useCallback(async () => {
    setError(null);

    // 1. Ưu tiên camera sau (environment) — đúng cho điện thoại
    try {
      await startScannerWithConfig({ facingMode: "environment" });
      return;
    } catch {
      // 2. Fallback: camera trước (user) — cho laptop
      try {
        await startScannerWithConfig({ facingMode: "user" });
        return;
      } catch {
        // 3. Cuối cùng: thử từng camera có sẵn
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices?.length) {
            await startScannerWithConfig({ deviceId: { exact: devices[0].id } });
            return;
          }
          throw new Error("no camera");
        } catch (err) {
          const message =
            (err as { name?: string })?.name === "NotAllowedError"
              ? "Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép camera trong trình duyệt!"
              : "Không thể truy cập camera. Vui lòng kiểm tra lại!";
          setError(message);
        }
      }
    }
  }, [startScannerWithConfig]);

  useEffect(() => {
    startScanner();
  }, [startScanner, retryCount]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleRetry = () => setRetryCount((c) => c + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[390px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Quét mã QR</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="text-sm text-red-400 text-center">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div
              id="qr-reader"
              className="w-full rounded-xl overflow-hidden bg-black"
            />
            <p className="text-center text-sm text-white/70 mt-4">
              Đưa mã QR vào khung để quét
            </p>
          </>
        )}
      </div>
    </div>
  );
}