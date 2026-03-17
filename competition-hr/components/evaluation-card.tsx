"use client";

import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { ScoreBadge } from "@/components/score-badge";
import { EVALUATION_QUESTIONS, TOTAL_MAX_SCORE } from "@/lib/constants";
import { getInitials, getAvatarColor } from "@/lib/utils";
import type { EvaluationWithReviewer } from "@/types/app";

interface EvaluationCardProps {
  evaluation: EvaluationWithReviewer;
}

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const reviewerName =
    evaluation.reviewer?.full_name ??
    evaluation.reviewer?.email ??
    "Unknown Reviewer";

  // Build answer lookup
  const answerMap = new Map(
    evaluation.answers.map((a) => [a.question_key, a])
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback
                className={`${getAvatarColor(reviewerName)} text-white text-xs`}
              >
                {getInitials(reviewerName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{reviewerName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {format(new Date(evaluation.created_at), "dd.MM.yyyy HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                evaluation.status === "submitted" ? "green" : "secondary"
              }
            >
              {evaluation.status === "submitted" ? "Poslato" : "Draft"}
            </Badge>
            <ScoreBadge
              score={evaluation.total_score}
              maxScore={TOTAL_MAX_SCORE}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Per-question scores */}
        {EVALUATION_QUESTIONS.map((q) => {
          const answer = answerMap.get(q.key);
          if (!answer) return null;
          return (
            <div key={q.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {q.label}
                </span>
              </div>
              <StarRating value={answer.score} readonly size="sm" />
              {answer.comment && (
                <p className="text-xs text-muted-foreground pl-1">
                  {answer.comment}
                </p>
              )}
            </div>
          );
        })}

        <Separator />

        {/* Explain ratings */}
        {evaluation.explain_ratings && (
          <div className="space-y-1">
            <span className="text-xs font-medium">Obrazloženje</span>
            <p className="text-sm whitespace-pre-wrap">
              {evaluation.explain_ratings}
            </p>
          </div>
        )}

        {/* Final comment */}
        {evaluation.final_comment && (
          <div className="space-y-1">
            <span className="text-xs font-medium">Završni komentar</span>
            <p className="text-sm whitespace-pre-wrap">
              {evaluation.final_comment}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

