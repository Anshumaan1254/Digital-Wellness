/* Static mountain-and-lake silhouette for page headers (no WebGL needed). */
export function MountainBackdrop({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="mb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1622" stopOpacity="0" />
          <stop offset="0.55" stopColor="#3b4766" stopOpacity="0.55" />
          <stop offset="1" stopColor="#c9b4b6" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="mb-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2a3d" />
          <stop offset="1" stopColor="#0b1622" />
        </linearGradient>
        <linearGradient id="mb-mist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9d6e2" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c9d6e2" stopOpacity="0.16" />
          <stop offset="1" stopColor="#c9d6e2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1440" height="320" fill="url(#mb-sky)" />
      <path
        d="M0 320 L120 210 L210 250 L330 150 L450 240 L560 180 L690 260 L800 130 L930 230 L1040 170 L1170 250 L1290 160 L1440 230 L1440 320 Z"
        fill="#67739b"
        opacity="0.55"
      />
      <path
        d="M0 320 L90 260 L200 285 L300 225 L420 290 L540 240 L660 295 L770 230 L900 290 L1010 250 L1130 300 L1260 245 L1440 290 L1440 320 Z"
        fill="#3a4564"
      />
      <path
        d="M0 320 L140 292 L260 305 L380 280 L520 310 L640 295 L780 312 L900 288 L1060 310 L1200 296 L1340 312 L1440 300 L1440 320 Z"
        fill="#1a2336"
      />
      <rect className="mist-layer" x="-80" y="250" width="1600" height="60" fill="url(#mb-mist)" />
      <rect y="320" width="1440" height="100" fill="url(#mb-water)" />
      <g opacity="0.22" fill="#3a4564">
        <path d="M0 320 L90 360 L200 345 L300 380 L420 340 L540 370 L660 338 L770 375 L900 340 L1010 362 L1130 335 L1260 365 L1440 340 L1440 320 Z" />
      </g>
      <g stroke="#8fd3c8" strokeLinecap="round" opacity="0.5">
        <line className="ripple-line" x1="420" y1="350" x2="1020" y2="350" strokeWidth="1" />
        <line className="ripple-line" x1="560" y1="372" x2="880" y2="372" strokeWidth="1" style={{ animationDelay: "2s" }} />
        <line className="ripple-line" x1="640" y1="392" x2="800" y2="392" strokeWidth="1" style={{ animationDelay: "4s" }} />
      </g>
    </svg>
  );
}
