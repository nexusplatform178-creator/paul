import React from "react";

interface FlagUgandaProps {
  className?: string;
}

const FlagUganda = ({ className = "w-5 h-3.5" }: FlagUgandaProps) => {
  return (
    <svg viewBox="0 0 640 480" className={className}>
      <defs>
        <clipPath id="ug-a">
          <path fillOpacity=".7" d="M0 0h640v480H0z" />
        </clipPath>
      </defs>
      <g fillRule="evenodd" clipPath="url(#ug-a)">
        {/* Black stripe */}
        <path fill="#000" d="M0 0h640v80H0z" />
        {/* Yellow stripe */}
        <path fill="#fcdc04" d="M0 80h640v80H0z" />
        {/* Red stripe */}
        <path fill="#d90000" d="M0 160h640v80H0z" />
        {/* Black stripe */}
        <path fill="#000" d="M0 240h640v80H0z" />
        {/* Yellow stripe */}
        <path fill="#fcdc04" d="M0 320h640v80H0z" />
        {/* Red stripe */}
        <path fill="#d90000" d="M0 400h640v80H0z" />
        {/* White circle */}
        <circle cx="320" cy="240" r="80" fill="#fff" />
        {/* Grey Crested Crane */}
        <g transform="translate(320 240) scale(0.8)">
          {/* Body */}
          <ellipse cx="0" cy="10" rx="25" ry="18" fill="#6b6b6b" />
          {/* Neck */}
          <path d="M-5 -5 Q-10 -30 0 -45" stroke="#6b6b6b" strokeWidth="8" fill="none" />
          {/* Head */}
          <circle cx="0" cy="-48" r="10" fill="#6b6b6b" />
          {/* Crown */}
          <g transform="translate(0 -55)">
            <path d="M-6 -8 L0 -15 L6 -8" stroke="#d4a017" strokeWidth="2" fill="none" />
            <circle cx="-6" cy="-8" r="2" fill="#d4a017" />
            <circle cx="6" cy="-8" r="2" fill="#d4a017" />
            <circle cx="0" cy="-15" r="2" fill="#d4a017" />
            <path d="M-4 -5 L0 -12 L4 -5" stroke="#d4a017" strokeWidth="2" fill="none" />
          </g>
          {/* Red patch */}
          <path d="M-3 -40 Q-8 -35 -3 -30" fill="#d90000" />
          {/* Eye */}
          <circle cx="3" cy="-50" r="2" fill="#000" />
          {/* Beak */}
          <path d="M8 -48 L18 -45 L8 -42 Z" fill="#6b6b6b" />
          {/* Legs */}
          <path d="M-5 25 L-8 45 M5 25 L8 45" stroke="#6b6b6b" strokeWidth="3" fill="none" />
          {/* Feet */}
          <path d="M-12 45 L-8 45 L-4 45 M4 45 L8 45 L12 45" stroke="#6b6b6b" strokeWidth="2" fill="none" />
        </g>
      </g>
    </svg>
  );
};

export default FlagUganda;
