import type { Tim, Clan, Evaluation, EvaluationAnswer, Profile } from "@/types/database";
import type { TeamWithDetails, EvaluationWithReviewer } from "@/types/app";
import { createClient } from "@/lib/supabase/client";

/** Fetch all teams with their members */
export async function fetchTeams(): Promise<TeamWithDetails[]> {
  const supabase = createClient();
  // 1. Get all teams
  const { data: teams, error: teamsError } = await supabase
    .from("timovi")
    .select("*")
    .order("created_at", { ascending: false });

  if (teamsError) throw teamsError;
  if (!teams) return [];

  // 2. Get all members
  const { data: allMembers, error: membersError } = await supabase
    .from("clanovi")
    .select("*");

  if (membersError) throw membersError;

  // 3. Get all evaluations with answers + reviewer profiles
  const { data: allEvaluations, error: evalsError } = await supabase
    .from("evaluations")
    .select("*, evaluation_answers(*), profiles:reviewer_id(*)");

  if (evalsError) throw evalsError;

  // Build lookup maps
  const membersByTeam = new Map<string, Clan[]>();
  (allMembers ?? []).forEach((m) => {
    const list = membersByTeam.get(m.tim_id) ?? [];
    list.push(m as Clan);
    membersByTeam.set(m.tim_id, list);
  });

  const evalsByTeam = new Map<string, EvaluationWithReviewer[]>();
  (allEvaluations ?? []).forEach((e: any) => {
    const evalItem: EvaluationWithReviewer = {
      ...e,
      reviewer: e.profiles as Profile,
      answers: (e.evaluation_answers ?? []) as EvaluationAnswer[],
    };
    const list = evalsByTeam.get(e.team_id) ?? [];
    list.push(evalItem);
    evalsByTeam.set(e.team_id, list);
  });

  return (teams as Tim[]).map((team) => {
    const evals = evalsByTeam.get(team.id) ?? [];
    const submittedEvals = evals.filter((e) => e.status === "submitted");
    const avgScore =
      submittedEvals.length > 0
        ? submittedEvals.reduce((sum, e) => sum + e.total_score, 0) /
          submittedEvals.length
        : 0;

    return {
      ...team,
      clanovi: membersByTeam.get(team.id) ?? [],
      evaluations: evals,
      avg_score: avgScore,
      review_count: submittedEvals.length,
    };
  });
}

/** Fetch a single team with full details */
export async function fetchTeam(id: string): Promise<TeamWithDetails | null> {
  const supabase = createClient();
  const { data: team, error: teamError } = await supabase
    .from("timovi")
    .select("*")
    .eq("id", id)
    .single();

  if (teamError || !team) return null;

  const { data: members } = await supabase
    .from("clanovi")
    .select("*")
    .eq("tim_id", id)
    .order("kapiten", { ascending: false });

  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("*, evaluation_answers(*), profiles:reviewer_id(*)")
    .eq("team_id", id)
    .order("created_at", { ascending: false });

  const evals: EvaluationWithReviewer[] = (evaluations ?? []).map((e: any) => ({
    ...e,
    reviewer: e.profiles as Profile,
    answers: (e.evaluation_answers ?? []) as EvaluationAnswer[],
  }));

  const submittedEvals = evals.filter((e) => e.status === "submitted");
  const avgScore =
    submittedEvals.length > 0
      ? submittedEvals.reduce((sum, e) => sum + e.total_score, 0) /
        submittedEvals.length
      : 0;

  return {
    ...(team as Tim),
    clanovi: (members ?? []) as Clan[],
    evaluations: evals,
    avg_score: avgScore,
    review_count: submittedEvals.length,
  };
}



