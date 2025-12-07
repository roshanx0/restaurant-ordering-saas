import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  text = "Loading...",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-accent animate-spin mb-3" />
      <p className="text-text-secondary">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{content}</div>
  );
};
