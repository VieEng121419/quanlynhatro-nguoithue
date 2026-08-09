import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const CardAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-start gap-3 p-4 bg-[#FEF08A] border-l-4 border-[#CA8A04] rounded-[20px]",
      className
    )}
    {...props}
  >
    <div className="pt-0.5 shrink-0">
      <TriangleAlert className="w-[22px] h-[19px] text-[#CA8A04]" />
    </div>
    <p className="text-base font-medium text-[#854D0E]">{children}</p>
  </div>
));
CardAlert.displayName = "CardAlert";

export { CardAlert };