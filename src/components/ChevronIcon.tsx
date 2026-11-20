type ChevronIconProps = {
  direction: "left" | "right";
  className?: string;
};

export function ChevronIcon({ direction, className = "" }: ChevronIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${direction === "left" ? "rotate-180" : ""} ${className}`}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
