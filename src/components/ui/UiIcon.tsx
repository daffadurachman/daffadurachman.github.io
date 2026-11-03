import React from 'react';

export type UiIconName =
  | 'arrow-up-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'download'
  | 'eye'
  | 'copy'
  | 'check'
  | 'mail'
  | 'message-circle'
  | 'close'
  | 'chevron-down'
  | 'more-horizontal'
  | 'lock'
  | 'file-text'
  | 'github'
  | 'search'
  | 'command'
  | 'terminal'
  | 'award'
  | 'layers'
  | 'globe';

export interface UiIconProps {
  name: UiIconName;
  size?: number;
  className?: string;
  opticalNudge?: boolean;
}

function getOpticalTransform(name: UiIconName, opticalNudge?: boolean): string | undefined {
  if (!opticalNudge) return undefined;
  switch (name) {
    case 'arrow-up-right':
      return 'translate(-0.5px, 0.5px)';
    case 'arrow-up':
      return 'translateY(0.5px)';
    case 'arrow-left':
      return 'translateX(0.5px)';
    case 'download':
      return 'translateY(-0.5px)';
    default:
      return undefined;
  }
}

export function UiIcon({ name, size = 16, className, opticalNudge = false }: UiIconProps) {
  const transform = getOpticalTransform(name, opticalNudge);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={transform ? { transform, flexShrink: 0 } : { flexShrink: 0 }}
      aria-hidden="true"
      focusable="false"
    >
      {name === 'arrow-up-right' && (
        <>
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </>
      )}

      {name === 'arrow-left' && (
        <>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </>
      )}

      {name === 'arrow-up' && (
        <>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </>
      )}

      {name === 'download' && (
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </>
      )}

      {name === 'eye' && (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}

      {name === 'copy' && (
        <>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      )}

      {name === 'check' && <polyline points="20 6 9 17 4 12" />}

      {name === 'mail' && (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </>
      )}

      {name === 'message-circle' && (
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      )}

      {name === 'close' && (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      )}

      {name === 'chevron-down' && <polyline points="6 9 12 15 18 9" />}

      {name === 'more-horizontal' && (
        <>
          <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.25" fill="currentColor" stroke="none" />
          <circle cx="5" cy="12" r="1.25" fill="currentColor" stroke="none" />
        </>
      )}

      {name === 'lock' && (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      )}

      {name === 'file-text' && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </>
      )}

      {name === 'github' && (
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2" />
      )}

      {name === 'search' && (
        <>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </>
      )}

      {name === 'command' && (
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
      )}

      {name === 'terminal' && (
        <>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </>
      )}

      {name === 'award' && (
        <>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </>
      )}

      {name === 'layers' && (
        <>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </>
      )}

      {name === 'globe' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
      )}
    </svg>
  );
}

