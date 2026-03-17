import type { QuestionDefinition } from "@/types/app";
import type { EvaluationQuestionKey } from "@/types/database";

/**
 * The 7 evaluation questions.
 * Labels are in Serbian/Croatian as specified.
 * Each scored 1–10.
 */
export const EVALUATION_QUESTIONS: QuestionDefinition[] = [
  {
    key: "motivacija_i_ciljevi",
    label:
      "Zašto smatrate da vaš tim treba da učestvuje na ovom takmičenju? Šta vas motiviše?",
    description: "Ocenite motivaciju i jasnoću ciljeva tima.",
  },
  {
    key: "prethodno_iskustvo_tima",
    label:
      "Opišite neko vaše zajedničko iskustvo kao tim? Kako ste se snašli, da li ste nailazili na probleme?",
    description: "Ocenite prethodna iskustva i timski rad.",
  },
  {
    key: "tehnologije_i_fit",
    label:
      "Koje programske jezike, framework-e, tehnologije i razvojne alate najbolje poznajete? Gde ste ih koristili? Koje tehnologije biste primenili na hakatonu?",
    description: "Ocenite tehničku spremnost i podudarnost sa disciplinom.",
  },
  {
    key: "konflikti_i_komunikacija",
    label:
      "Šta biste uradili ukoliko dođe do konflikta među članovima tima?",
    description: "Ocenite sposobnost rešavanja konflikata i komunikaciju.",
  },
  {
    key: "prioriteti_i_vreme",
    label:
      "Kako planirate da organizujete vreme i postavite prioritete tokom takmičenja?",
    description: "Ocenite sposobnost planiranja i upravljanja vremenom.",
  },
  {
    key: "kvalitet_prijave",
    label:
      "Kvalitet i kompletnost prijave (jasnoća odgovora, detalji, celokupan utisak).",
    description:
      "Ocenite koliko je prijava jasna, kompletna i profesionalno napisana.",
  },
  {
    key: "opsti_utisak_potencijal",
    label:
      "Opšti utisak i potencijal tima (ukupna procena spremnosti tima).",
    description:
      "Dajte ukupnu ocenu potencijala tima na osnovu svih informacija.",
  },
];

/** Max possible score per question */
export const MAX_SCORE_PER_QUESTION = 10;

/** Total max score (7 questions × 10) */
export const TOTAL_MAX_SCORE = EVALUATION_QUESTIONS.length * MAX_SCORE_PER_QUESTION;

/** All question keys for iteration */
export const QUESTION_KEYS: EvaluationQuestionKey[] = EVALUATION_QUESTIONS.map(
  (q) => q.key
);

/** Discipline display labels */
export const DISCIPLINE_LABELS: Record<string, string> = {
  "fon-hackathon": "FON Hackathon",
  gamejam: "GameJam",
  blockchain: "Blockchain",
};

/** Filter sort options */
export const SORT_OPTIONS = [
  { value: "newest", label: "Najnovije" },
  { value: "oldest", label: "Najstarije" },
  { value: "score-high", label: "Najviši skor" },
  { value: "score-low", label: "Najniži skor" },
  { value: "name-asc", label: "Ime (A-Ž)" },
  { value: "name-desc", label: "Ime (Ž-A)" },
];


