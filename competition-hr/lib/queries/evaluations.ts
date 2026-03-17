import { createClient } from "@/lib/supabase/client";
import type { EvaluationQuestionKey } from "@/types/database";
import { QUESTION_KEYS } from "@/lib/constants";

interface SubmitEvaluationParams {
  teamId: string;
  reviewerId: string;
  scores: Record<EvaluationQuestionKey, number>;
  comments: Record<EvaluationQuestionKey, string>;
  explainRatings: string;
  finalComment: string;
}

/**
 * Submits a complete evaluation (upsert evaluation + answers).
 * Creates a new row or updates the existing one for this reviewer + team.
 */
export async function submitEvaluation(params: SubmitEvaluationParams) {
  const supabase = createClient();
  const {
    teamId,
    reviewerId,
    scores,
    comments,
    explainRatings,
    finalComment,
  } = params;

  // 1. Upsert the evaluation row
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const maxScore = QUESTION_KEYS.length * 10;

  const { data: evaluation, error: evalError } = await supabase
    .from("evaluations")
    .upsert(
      {
        team_id: teamId,
        reviewer_id: reviewerId,
        status: "submitted",
        explain_ratings: explainRatings,
        final_comment: finalComment || null,
        total_score: totalScore,
        max_score: maxScore,
      },
      { onConflict: "team_id,reviewer_id" }
    )
    .select()
    .single();

  if (evalError) throw evalError;

  // 2. Upsert each answer
  const answersToUpsert = QUESTION_KEYS.map((key) => ({
    evaluation_id: evaluation.id,
    question_key: key,
    score: scores[key],
    comment: comments[key] || null,
  }));

  const { error: answersError } = await supabase
    .from("evaluation_answers")
    .upsert(answersToUpsert, {
      onConflict: "evaluation_id,question_key",
    });

  if (answersError) throw answersError;

  return evaluation;
}

/** Check if the current user already has an evaluation for a team */
export async function getMyEvaluation(teamId: string, reviewerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("evaluations")
    .select("*, evaluation_answers(*)")
    .eq("team_id", teamId)
    .eq("reviewer_id", reviewerId)
    .maybeSingle();

  if (error) throw error;
  return data;
}




