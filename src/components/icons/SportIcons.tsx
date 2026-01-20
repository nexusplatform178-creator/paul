import React from "react";

interface SportIconProps {
  className?: string;
}

export const FootballIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7l2.5 1.8-.95 3.1H10.45l-.95-3.1z" fill="currentColor" />
    <path d="M12 2v5M12 22v-5M2 12h5M22 12h-5M4.93 4.93l3.54 3.54M19.07 19.07l-3.54-3.54M4.93 19.07l3.54-3.54M19.07 4.93l-3.54 3.54" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export const BasketballIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20" />
  </svg>
);

export const TennisIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M5 3c3 4 3 14 0 18M19 3c-3 4-3 14 0 18" />
  </svg>
);

export const AmericanFootballIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <ellipse cx="12" cy="12" rx="10" ry="6" />
    <path d="M12 6v12M8 9l8 6M16 9l-8 6" />
  </svg>
);

export const IceHockeyIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M4 12h3M17 12h3M12 4v3M12 17v3" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const BaseballIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M5 5c2 2 2 12 0 14M19 5c-2 2-2 12 0 14" />
  </svg>
);

export const TrophyIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export const StarIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const MoreDotsIcon = ({ className = "w-4 h-4" }: SportIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);
