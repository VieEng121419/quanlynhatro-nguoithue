"use client";

import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import { PushRegistration } from "@/components/PushRegistration";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PushRegistration />
      {children}
      <ToastViewport />
    </ToastProvider>
  );
}
