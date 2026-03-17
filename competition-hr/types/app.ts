// ============================================================
// App-level composed types (joins, aggregates, UI helpers)
// ============================================================

import type {
  Tim,
  Clan,
  Evaluation,
  EvaluationAnswer,
  Profile,
  EvaluationQuestionKey,
} from "./database";

/** Team with members + evaluation aggregates for dashboard cards */
export interface TeamWithDetails extends Tim {
  clanovi: Clan[];
  evaluations: EvaluationWithReviewer[];
  avg_score: number;
  review_count: number;
}

/** Evaluation joined with reviewer profile + individual answers */
export interface EvaluationWithReviewer extends Evaluation {
  reviewer: Profile;
  answers: EvaluationAnswer[];
}

/** Single question definition (for the rating form) */
export interface QuestionDefinition {
  key: EvaluationQuestionKey;
  label: string;        // Serbian/Croatian original text
  description: string;  // Explanation for the reviewer
}

/** Rating form values (used in Zod schema) */
export interface EvaluationFormValues {
  scores: Record<EvaluationQuestionKey, number>;
  comments: Record<EvaluationQuestionKey, string>;
  explain_ratings: string;
  final_comment: string;
}

/** Filter state for dashboard */
export interface FiltersState {
  search: string;
  discipline: string;
  status: string;
  sortBy: string;
  setSearch: (s: string) => void;
  setDiscipline: (d: string) => void;
  setStatus: (s: string) => void;
  setSortBy: (s: string) => void;
  resetFilters: () => void;
}

