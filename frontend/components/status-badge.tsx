import { cn } from "@/lib/utils";
import type { SollicitatieStatus } from "@/lib/types";
import { STATUS_COLORS } from "@/lib/types";

interface StatusBadgeProps {
  status: SollicitatieStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      {status}
    </span>
  );
}
