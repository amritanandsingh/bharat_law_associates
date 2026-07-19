import React, { useId } from 'react';
import './Logo.css';

// "Pillar & Scales under the Arch" — fluted pillar of justice carrying a
// balance beam, framed in an Indo-Saracenic arch. Original mark; deliberately
// avoids the (government-restricted) Ashoka emblem and chakra.

export const LogoMark = ({ size = 40, variant = 'dark', className = '' }) => {
  const uid = useId();
  const gradId = `blaGold-${uid}`;
  const stops =
    variant === 'light'
      ? [
          ['0', '#C9A227'],
          ['1', '#8C6D1A'],
        ]
      : [
          ['0', '#E9CE77'],
          ['0.55', '#C9A227'],
          ['1', '#9A7B1D'],
        ];
  const gold = `url(#${gradId})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="48" y1="8" x2="48" y2="88" gradientUnits="userSpaceOnUse">
          {stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>

      {/* Arch niche */}
      <path
        d="M16 82 V48 C16 25 30 14 48 10 C66 14 80 25 80 48 V82"
        stroke={gold}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Ground line */}
      <path d="M10 82 H86" stroke={gold} strokeWidth="2.5" strokeLinecap="round" />
      {/* Plinth steps */}
      <rect x="30" y="74" width="36" height="4" rx="1" fill={gold} />
      <rect x="36" y="68" width="24" height="4" rx="1" fill={gold} />
      {/* Fluted shaft */}
      <rect x="43" y="36" width="2.4" height="32" rx="1.2" fill={gold} />
      <rect x="46.8" y="36" width="2.4" height="32" rx="1.2" fill={gold} />
      <rect x="50.6" y="36" width="2.4" height="32" rx="1.2" fill={gold} />
      {/* Capital + centre post */}
      <rect x="41" y="32" width="14" height="3" rx="1.5" fill={gold} />
      <rect x="46.75" y="27" width="2.5" height="6" fill={gold} />
      {/* Balance beam */}
      <path d="M27 28 H69" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      {/* Lotus-bud finial */}
      <path d="M48 16 l4 5 -4 5 -4 -5 Z" fill={gold} />
      {/* Chains */}
      <path d="M27 28 V38" stroke={gold} strokeWidth="2" strokeLinecap="round" />
      <path d="M69 28 V38" stroke={gold} strokeWidth="2" strokeLinecap="round" />
      {/* Pans (lower semicircles) */}
      <path d="M19.5 38 H34.5 A7.5 7.5 0 0 1 19.5 38 Z" fill={gold} />
      <path d="M61.5 38 H76.5 A7.5 7.5 0 0 1 61.5 38 Z" fill={gold} />
    </svg>
  );
};

const Logo = ({ variant = 'dark', markSize = 40, stacked = false }) => (
  <span className={`logo-lockup ${stacked ? 'logo-stacked' : ''} logo-${variant}`}>
    <LogoMark size={markSize} variant={variant} />
    <span className="logo-text">
      <span className="logo-line1">Bharat Law</span>
      <span className="logo-line2">Associates</span>
    </span>
  </span>
);

export default Logo;
