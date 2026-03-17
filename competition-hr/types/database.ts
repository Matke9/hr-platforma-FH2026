// ============================================================
// Database types — mirrors the Supabase schema exactly
// ============================================================

export type EvaluationQuestionKey =
  | "motivacija_i_ciljevi"
  | "prethodno_iskustvo_tima"
  | "tehnologije_i_fit"
  | "konflikti_i_komunikacija"
  | "prioriteti_i_vreme"
  | "kvalitet_prijave"
  | "opsti_utisak_potencijal";

export type Discipline = "fon-hackathon" | "gamejam" | "blockchain";
export type EvaluationStatus = "draft" | "submitted";
export type ProfileRole = "admin" | "reviewer";

// ---------- timovi ----------
export interface Tim {
  id: string;
  ime_tima: string;
  discipline: Discipline;
  kako_ste_culi: string[] | null;
  motivacija: string;
  prethodna_iskustva: string;
  konflikt_resenje: string;
  prioriteti_vreme: string | null;
  iskustvo_video_igre: string | null;
  created_at: string;
  tehnologije: string | null;
}

// ---------- clanovi ----------
export interface Clan {
  id: string;
  tim_id: string;
  ime_prezime: string;
  email: string;
  telefon: string;
  kapiten: boolean | null;
  godine: number;
  grad: string;
  status: string[];
  srednja_skola: string | null;
  godina_skolovanja: string | null;
  fakultet_skola: string | null;
  godina_studija: string | null;
  cv_link: string;
  github_link: string | null;
  created_at: string;
  firma: string | null;
}

// ---------- profiles ----------
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: ProfileRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- evaluations ----------
export interface Evaluation {
  id: string;
  team_id: string;
  reviewer_id: string;
  status: EvaluationStatus;
  explain_ratings: string;
  final_comment: string | null;
  total_score: number;
  max_score: number;
  created_at: string;
  updated_at: string;
}

// ---------- evaluation_answers ----------
export interface EvaluationAnswer {
  id: string;
  evaluation_id: string;
  question_key: EvaluationQuestionKey;
  score: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

