"use client";

import { ToastProvider, ToastViewport } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  );
}