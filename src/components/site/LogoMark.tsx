export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="22.5" cy="8.5" r="3" fill="#f1c9a5" />
      <path d="M2 18 L10 8 L15 13.5 L19 9.5 L30 18 Z" fill="#8e98ba" />
      <path d="M2 18 L8 13 L13 16 L18 12.5 L24 15.5 L30 18 Z" fill="#454f70" />
      <path d="M2 18 L10 28 L15 22.5 L19 26.5 L30 18 Z" fill="#8fd3c8" opacity="0.28" />
      <path d="M5 21.5 H27 M9 24.5 H23" stroke="#8fd3c8" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
