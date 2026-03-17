"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { useSubmitEvaluation } from "@/hooks/use-evaluations";
import { useAuth } from "@/hooks/use-auth";
import { getMyEvaluation } from "@/lib/queries/evaluations";
import {
  EVALUATION_QUESTIONS,
  QUESTION_KEYS,
  TOTAL_MAX_SCORE,
} from "@/lib/constants";
import type { EvaluationQuestionKey } from "@/types/database";

interface EvaluationDialogProps {
  teamId: string;
  teamName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EvaluationDialog({
  teamId,
  teamName,
  open,
  onOpenChange,
}: EvaluationDialogProps) {
  const { user } = useAuth();
  const submitMutation = useSubmitEvaluation();

  const [scores, setScores] = useState<Record<EvaluationQuestionKey, number>>(
    () =>
      Object.fromEntries(
        QUESTION_KEYS.map((k) => [k, 0])
      ) as Record<EvaluationQuestionKey, number>
  );

  const [comments, setComments] = useState<
    Record<EvaluationQuestionKey, string>
  >(
    () =>
      Object.fromEntries(
        QUESTION_KEYS.map((k) => [k, ""])
      ) as Record<EvaluationQuestionKey, string>
  );

  const [explainRatings, setExplainRatings] = useState("");
  const [finalComment, setFinalComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing evaluation if any
  useEffect(() => {
    if (open && user?.id) {
      getMyEvaluation(teamId, user.id).then((existing) => {
        if (existing) {
          setExplainRatings(existing.explain_ratings ?? "");
          setFinalComment(existing.final_comment ?? "");
          const answers = existing.evaluation_answers ?? [];
          const newScores = { ...scores };
          const newComments = { ...comments };
          answers.forEach((a: any) => {
            if (QUESTION_KEYS.includes(a.question_key)) {
              newScores[a.question_key as EvaluationQuestionKey] = a.score;
              newComments[a.question_key as EvaluationQuestionKey] =
                a.comment ?? "";
            }
          });
          setScores(newScores);
          setComments(newComments);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id, teamId]);

  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);

  const allScored = QUESTION_KEYS.every((k) => (scores as Record<string, number>)[k] > 0);

  const handleSubmit = async () => {
    if (!user?.id || !allScored) return;
    setLoading(true);
    try {
      await submitMutation.mutateAsync({
        teamId,
        reviewerId: user.id,
        scores,
        comments,
        explainRatings,
        finalComment,
      });
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to submit evaluation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Evaluacija: {teamName}</DialogTitle>
          <DialogDescription>
            Ocenite tim na skali od 1 do 10 za svako pitanje. Ukupan skor:{" "}
            <strong>
              {totalScore} / {TOTAL_MAX_SCORE}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {EVALUATION_QUESTIONS.map((q, index) => (
            <div key={q.key} className="space-y-2">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  {index + 1}. {q.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {q.description}
                </p>
              </div>

              <StarRating
                value={scores[q.key]}
                onChange={(val) =>
                  setScores((prev) => ({ ...prev, [q.key]: val }))
                }
              />

              <Textarea
                placeholder="Komentar (opciono)..."
                value={comments[q.key]}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [q.key]: e.target.value,
                  }))
                }
                rows={2}
              />

              {index < EVALUATION_QUESTIONS.length - 1 && <Separator />}
            </div>
          ))}

          <Separator />

          {/* Explain ratings */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Obrazloženje ocena (obavezno)
            </Label>
            <Textarea
              placeholder="Obrazložite svoje ocene..."
              value={explainRatings}
              onChange={(e) => setExplainRatings(e.target.value)}
              rows={3}
            />
          </div>

          {/* Final comment */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Završni komentar (opciono)
            </Label>
            <Textarea
              placeholder="Dodatni komentari..."
              value={finalComment}
              onChange={(e) => setFinalComment(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Otkaži
          </Button>
          <Button
            variant="orange"
            onClick={handleSubmit}
            disabled={!allScored || !explainRatings.trim() || loading}
          >
            {loading ? "Šaljem..." : "Pošalji evaluaciju"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


