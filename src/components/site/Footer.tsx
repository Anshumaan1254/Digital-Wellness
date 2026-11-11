import Link from "next/link";
import { NAV } from "@/data/nav";
import { LogoMark } from "./LogoMark";
import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-[#08111b]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7" />
            <span className="font-serif text-lg">Digital Wellness Hub</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            A student-made guide to choosing and setting up tools for calmer, safer technology use. Product details
            were checked against official sources on {SITE.checkedLabel}. Prices and features change, so please confirm on the
            official page before paying for anything.
          </p>
          <p className="text-sm text-muted-foreground">No adverts, no affiliate links, no tracking cookies.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-mist">Explore</h2>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link className="text-muted-foreground hover:text-foreground" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-mist">About this project</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link className="text-muted-foreground hover:text-foreground" href="/evidence/accessibility">
                Accessibility checklist
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-foreground" href="/evidence/sources">
                Sources and dates checked
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-foreground" href="/evidence/report">
                Project report
              </Link>
            </li>
            <li>
              <a className="text-muted-foreground hover:text-foreground" href={SITE.repoUrl}>
                Source code on GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        Made for a school project on digital wellbeing · {SITE.year}
      </div>
    </footer>
  );
}
