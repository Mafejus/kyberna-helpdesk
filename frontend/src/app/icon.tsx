import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#1d4ed8',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ticket shape */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" fill="white" opacity="0.9" />
          <line x1="7" y1="9" x2="17" y2="9" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
          <line x1="7" y1="12" x2="14" y2="12" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="17" r="4" fill="#22c55e" />
          <path d="M16 17l1.2 1.2L20 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
