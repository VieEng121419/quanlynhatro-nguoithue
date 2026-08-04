"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Package, User } from "lucide-react";

const navItems = [
  { href: "/home", label: "Trang chủ", icon: Home },
  { href: "/invoices", label: "Hoá đơn", icon: Receipt },
  { href: "/services", label: "Dịch vụ", icon: Package },
  { href: "/profile", label: "Cá nhân", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-[#A73414]/20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 rounded-lg ${
                isActive ? "text-[#A73414] bg-[#C84B2A]/10" : "text-[#6B7280]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`text-[10px] leading-tight ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}