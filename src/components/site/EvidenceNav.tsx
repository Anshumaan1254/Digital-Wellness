import Link from "next/link";
import { cn } from "@/lib/utils";

export const EVIDENCE = [
  { href: "/evidence", label: "Overview" },
  { href: "/evidence/sources", label: "Sources & dates" },
  { href: "/evidence/link-test", label: "Link test" },
  { href: "/evidence/accessibility", label: "Accessibility" },
  { href: "/evidence/feedback", label: "User feedback" },
  { href: "/evidence/revisions", label: "Revisions" },
  { href: "/evidence/report", label: "Report" },
];

export function EvidenceNav({ current }: { current: string }) {
  return (
    <nav aria-label="Project evidence" className="mx-auto max-w-7xl px-4 sm:px-6">
      <ul className="flex flex-wrap gap-2 border-b border-border pb-4">
        {EVIDENCE.map((e) => (
          <li key={e.href}>
            <Link
              href={e.href}
              aria-current={current === e.href ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm",
                current === e.href ? "bg-lake/15 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {e.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
