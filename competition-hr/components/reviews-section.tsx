"use client";

import React from "react";
import { EvaluationCard } from "@/components/evaluation-card";
import type { EvaluationWithReviewer } from "@/types/app";

interface ReviewsSectionProps {
  evaluations: EvaluationWithReviewer[];
}

export function ReviewsSection({ evaluations }: ReviewsSectionProps) {
  const submitted = evaluations.filter((e) => e.status === "submitted");

  if (submitted.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Još uvek nema recenzija za ovaj tim.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submitted.map((evaluation) => (
        <EvaluationCard key={evaluation.id} evaluation={evaluation} />
      ))}
    </div>
  );
}

