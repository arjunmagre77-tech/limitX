import React from "react";
import { CheckCircle2, ShieldCheck, Zap, Trophy } from "lucide-react";

interface VerificationBadgeProps {
  type?: string | null;
  className?: string;
}

export function VerificationBadge({ type, className = "w-4 h-4 inline-block ml-1" }: VerificationBadgeProps) {
  if (!type) return null;

  switch (type) {
    case "org":
      return (
        <span title="Verified Organization" className="inline-flex items-center text-blue-400">
          <CheckCircle2 className={className} fill="#3b82f6" color="#000" />
        </span>
      );
    case "player":
      return (
        <span title="Verified Pro Player" className="inline-flex items-center text-purple-400">
          <Zap className={className} fill="#a855f7" color="#000" />
        </span>
      );
    case "creator":
      return (
        <span title="Verified Creator" className="inline-flex items-center text-primary">
          <ShieldCheck className={className} fill="#22c55e" color="#000" />
        </span>
      );
    case "organizer":
      return (
        <span title="Verified Tournament Organizer" className="inline-flex items-center text-amber-400">
          <Trophy className={className} fill="#f59e0b" color="#000" />
        </span>
      );
    default:
      return (
        <span title="Verified" className="inline-flex items-center text-primary">
          <CheckCircle2 className={className} />
        </span>
      );
  }
}
