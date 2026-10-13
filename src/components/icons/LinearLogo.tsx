export function LinearLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.2 59.8C-0.4 61.4-0.4 64 1.2 65.6L34.4 98.8C36 100.4 38.6 100.4 40.2 98.8L98.8 40.2C100.4 38.6 100.4 36 98.8 34.4L65.6 1.2C64 -0.4 61.4 -0.4 59.8 1.2L1.2 59.8ZM12.5 62.7L62.7 12.5L87.5 37.3L37.3 87.5L12.5 62.7Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LightningIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}