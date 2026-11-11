import type { ReactNode } from "react";

/*
 * Simplified drawings of phone settings screens for the wind-down guide.
 * They are illustrations, not screenshots: no real phone, apps or
 * notifications were captured. Labels follow Google's and Apple's help pages.
 */

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 ${on ? "bg-[#3d8b7d] justify-end" : "bg-[#c9ced6] justify-start"}`}
    >
      <span className="h-4 w-4 rounded-full bg-white shadow" />
    </span>
  );
}

function Row({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-black/5 px-3 py-2.5 text-[11px] text-[#1f2933]">
      <span className="min-w-0">{children}</span>
      {right}
    </div>
  );
}

function AppDot({ color }: { color: string }) {
  return <span className="mr-2 inline-block h-5 w-5 rounded-md align-middle" style={{ background: color }} />;
}

function Frame({ ios, title, children }: { ios?: boolean; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-[240px] rounded-[34px] border-[6px] border-[#1c2433] bg-[#1c2433] shadow-2xl">
      <div className={`overflow-hidden rounded-[28px] ${ios ? "bg-[#f2f2f7]" : "bg-[#f7f9fb]"}`}>
        <div className="flex items-center justify-between px-5 pt-2 text-[9px] font-semibold text-[#1f2933]">
          <span>9:41</span>
          <span className={`h-3 ${ios ? "w-14 rounded-full bg-[#1c2433]" : "w-2 rounded-full bg-[#1c2433]"}`} />
          <span>●●●</span>
        </div>
        <div className={`px-3 pb-1 pt-3 ${ios ? "text-[17px] font-bold" : "text-[15px] font-medium"} text-[#111827]`}>{title}</div>
        <div className="px-2 pb-4">{children}</div>
      </div>
    </div>
  );
}

const VARIANTS: Record<string, () => ReactNode> = {
  "android-app-timer": () => (
    <Frame title="App timers">
      <div className="rounded-2xl bg-white">
        <Row right={<span className="rounded-full bg-[#d7ece8] px-2 py-0.5 text-[10px] text-[#1f5c52]">30 min</span>}>
          <AppDot color="#e0625a" />
          Video app
        </Row>
        <Row right={<span className="text-[10px] text-[#3d6fb4]">Set timer</span>}>
          <AppDot color="#c58ad9" />
          Photo sharing
        </Row>
        <Row right={<span className="text-[10px] text-[#3d6fb4]">Set timer</span>}>
          <AppDot color="#5aa6e0" />
          Short videos
        </Row>
        <Row right={<span className="text-[10px] text-[#3d6fb4]">Set timer</span>}>
          <AppDot color="#7cc48f" />
          Messages
        </Row>
      </div>
      <p className="px-2 pt-2 text-[9.5px] leading-snug text-[#4b5563]">When time runs out the app closes and its icon dims. Timers reset at midnight.</p>
    </Frame>
  ),
  "android-bedtime": () => (
    <Frame title="Bedtime mode">
      <div className="rounded-2xl bg-white">
        <Row right={<span className="text-[10px] text-[#1f5c52]">●</span>}>Use a schedule</Row>
        <Row right={<span className="text-[10px] text-[#6b7280]">○</span>}>Turn on while charging</Row>
        <Row right={<span className="text-[10px]">22:30 – 07:00</span>}>Sun – Thu</Row>
      </div>
      <p className="px-2 pb-1 pt-3 text-[10px] font-semibold text-[#374151]">Screen options at bedtime</p>
      <div className="rounded-2xl bg-white">
        <Row right={<Toggle on />}>Grayscale</Row>
        <Row right={<Toggle on />}>Keep the screen dark</Row>
        <Row right={<Toggle on={false} />}>Dim the wallpaper</Row>
      </div>
    </Frame>
  ),
  "iphone-allowance": () => (
    <Frame ios title="Time Allowances">
      <div className="rounded-xl bg-white">
        <Row right={<span className="text-[10px] text-[#4b5563]">45 min ›</span>}>Social Media</Row>
        <Row right={<span className="text-[10px] text-[#4b5563]">1 hr ›</span>}>Entertainment</Row>
        <Row right={<span className="text-[10px] text-[#4b5563]">30 min ›</span>}>Games</Row>
      </div>
      <div className="mt-3 rounded-xl bg-white px-3 py-3">
        <div className="text-[10px] text-[#374151]">Social Media · daily</div>
        <div className="mt-2 h-1.5 rounded-full bg-[#e5e7eb]">
          <div className="h-1.5 w-[38%] rounded-full bg-[#4f7ad9]" />
        </div>
        <div className="mt-1 text-right text-[10px] font-semibold text-[#1f2933]">45 min</div>
      </div>
      <div className="mt-3 rounded-xl bg-white">
        <Row right={<Toggle on />}>Match Screen Time Schedule</Row>
      </div>
    </Frame>
  ),
  "iphone-sleep": () => (
    <Frame ios title="Sleep">
      <div className="rounded-xl bg-white">
        <Row right={<span className="text-[10px] text-[#4b5563]">22:30</span>}>Bedtime</Row>
        <Row right={<span className="text-[10px] text-[#4b5563]">07:00</span>}>Wake up</Row>
        <Row right={<span className="text-[10px] text-[#4b5563]">45 min</span>}>Wind Down</Row>
      </div>
      <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wide text-[#4b5563]">Sleep Focus</p>
      <div className="rounded-xl bg-white">
        <Row right={<span className="text-[10px] text-[#4b5563]">Family ›</span>}>Allowed People</Row>
        <Row right={<span className="text-[10px] text-[#4b5563]">Alarms ›</span>}>Allowed Apps</Row>
        <Row right={<Toggle on />}>Share Focus Status</Row>
      </div>
    </Frame>
  ),
};

export function PhoneIllustration({ variant, alt, bare = false }: { variant: string; alt: string; bare?: boolean }) {
  const draw = VARIANTS[variant];
  if (!draw) return null;
  return (
    <div
      role="img"
      aria-label={alt}
      className={bare ? "flex h-full items-center justify-center [&>div>div]:scale-[1.15]" : "rounded-3xl bg-gradient-to-b from-[#1a2c3f] to-[#0f1c2a] px-4 py-8"}
    >
      <div aria-hidden="true">{draw()}</div>
    </div>
  );
}
