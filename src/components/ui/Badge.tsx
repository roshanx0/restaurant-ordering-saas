import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "neutral" | "accent-secondary";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  className = "",
}) => {
  const variants = {
    success: "badge-success",
    error: "badge-error",
    warning: "badge-warning",
    neutral: "badge-neutral",
    "accent-secondary": "bg-accent-secondary/10 text-accent-secondary",
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
