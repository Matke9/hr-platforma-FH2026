"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  maxScore: number;
  className?: string;
}

export function ScoreBadge({ score, maxScore, className }: ScoreBadgeProps) {
  const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;

  let colorClass = "bg-gray-100 text-gray-600";
  if (percent >= 80) colorClass = "bg-green-100 text-green-700";
  else if (percent >= 60) colorClass = "bg-blue-100 text-blue-700";
  else if (percent >= 40) colorClass = "bg-yellow-100 text-yellow-700";
  else if (percent > 0) colorClass = "bg-red-100 text-red-700";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-semibold",
        colorClass,
        className
      )}
    >
      {score > 0 ? score.toFixed(1) : "—"}
    </div>
  );
}

