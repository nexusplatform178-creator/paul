import React from "react";

interface FlagProps {
  className?: string;
}

export const FlagEurope = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#003399" width="640" height="480" />
    <g fill="#fc0">
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = 320 + 100 * Math.cos(angle);
        const y = 240 + 100 * Math.sin(angle);
        return (
          <polygon
            key={i}
            points={`${x},${y - 15} ${x + 5},${y - 5} ${x + 15},${y - 5} ${x + 7},${y + 3} ${x + 10},${y + 15} ${x},${y + 8} ${x - 10},${y + 15} ${x - 7},${y + 3} ${x - 15},${y - 5} ${x - 5},${y - 5}`}
          />
        );
      })}
    </g>
  </svg>
);

export const FlagPortugal = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#006600" width="256" height="480" />
    <rect fill="#ff0000" x="256" width="384" height="480" />
    <circle cx="256" cy="240" r="80" fill="#ffcc00" />
    <circle cx="256" cy="240" r="60" fill="#ff0000" />
    <circle cx="256" cy="240" r="45" fill="#fff" />
  </svg>
);

export const FlagItaly = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#009246" width="213" height="480" />
    <rect fill="#fff" x="213" width="214" height="480" />
    <rect fill="#ce2b37" x="427" width="213" height="480" />
  </svg>
);

export const FlagSpain = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#c60b1e" width="640" height="480" />
    <rect fill="#ffc400" y="120" width="640" height="240" />
  </svg>
);

export const FlagEngland = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#fff" width="640" height="480" />
    <rect fill="#ce1124" x="280" width="80" height="480" />
    <rect fill="#ce1124" y="200" width="640" height="80" />
  </svg>
);

export const FlagGermany = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#000" width="640" height="160" />
    <rect fill="#dd0000" y="160" width="640" height="160" />
    <rect fill="#ffcc00" y="320" width="640" height="160" />
  </svg>
);

export const FlagFrance = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#0055a4" width="213" height="480" />
    <rect fill="#fff" x="213" width="214" height="480" />
    <rect fill="#ef4135" x="427" width="213" height="480" />
  </svg>
);

export const FlagUkraine = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#005bbb" width="640" height="240" />
    <rect fill="#ffd500" y="240" width="640" height="240" />
  </svg>
);

export const FlagScotland = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#0065bd" width="640" height="480" />
    <path fill="#fff" d="M0 0L640 480M640 0L0 480" strokeWidth="60" stroke="#fff" />
  </svg>
);

export const FlagRomania = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#002b7f" width="213" height="480" />
    <rect fill="#fcd116" x="213" width="214" height="480" />
    <rect fill="#ce1126" x="427" width="213" height="480" />
  </svg>
);

export const FlagSweden = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#006aa7" width="640" height="480" />
    <rect fill="#fecc00" x="180" width="80" height="480" />
    <rect fill="#fecc00" y="200" width="640" height="80" />
  </svg>
);

export const FlagPoland = ({ className = "w-5 h-3.5" }: FlagProps) => (
  <svg viewBox="0 0 640 480" className={className}>
    <rect fill="#fff" width="640" height="240" />
    <rect fill="#dc143c" y="240" width="640" height="240" />
  </svg>
);
