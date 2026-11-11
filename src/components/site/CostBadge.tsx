import { COST_LABEL, type CostTone } from "@/data/resources";
import { cn } from "@/lib/utils";

const TONE: Record<CostTone, string> = {
  free: "bg-[#173a36] text-[#a6e6da] ring-[#8fd3c8]/30",
  "free-core": "bg-[#2a2f45] text-[#cfc9f5] ring-[#c3bdf0]/30",
  limited: "bg-[#3e2f24] text-[#f6d3b3] ring-[#f1c9a5]/30",
};

export function CostBadge({ tone, className }: { tone: CostTone; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", TONE[tone], className)}
      title={COST_LABEL[tone].hint}
    >
      {COST_LABEL[tone].label}
    </span>
  );
}
