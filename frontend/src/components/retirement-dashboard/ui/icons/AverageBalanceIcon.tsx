import { FC } from "react";

interface AverageBalanceIconProps {
  className?: string;
}

export const AverageBalanceIcon: FC<AverageBalanceIconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
  </svg>
);
