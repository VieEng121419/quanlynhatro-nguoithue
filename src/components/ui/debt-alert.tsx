import * as React from "react";

import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

const DebtAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-start gap-3 p-4 bg-[#FFDAD6] rounded-[20px]",
      className
    )}
    {...props}
  >
    <div className="pt-0.5 shrink-0">
      <TriangleAlert className="w-[22px] h-[19px] text-[#BA1A1A]" />
    </div>
    <div className="flex flex-col gap-0.5">
      <p className="text-base font-semibold text-[#93000A]">
        Cảnh Báo Nợ Cước
      </p>
      <p className="text-sm font-medium text-[#93000A]">{children}</p>
    </div>
  </div>
));
DebtAlert.displayName = "DebtAlert";

export { DebtAlert };