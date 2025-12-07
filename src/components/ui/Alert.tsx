import React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}) => {
  const styles = {
    success: {
      bg: "bg-success/10",
      border: "border-success",
      text: "text-success",
      icon: CheckCircle,
    },
    error: {
      bg: "bg-error/10",
      border: "border-error",
      text: "text-error",
      icon: AlertCircle,
    },
    warning: {
      bg: "bg-warning/10",
      border: "border-warning",
      text: "text-warning",
      icon: AlertCircle,
    },
    info: {
      bg: "bg-accent-secondary/10",
      border: "border-accent-secondary",
      text: "text-accent-secondary",
      icon: Info,
    },
  };

  const config = styles[type];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} border-l-4 ${config.border} p-4 rounded ${className}`}
    >
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.text} mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold ${config.text} mb-1`}>{title}</h4>
          )}
          <p className="text-sm text-text">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-text-secondary hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
