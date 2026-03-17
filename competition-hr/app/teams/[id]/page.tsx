"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Users, ClipboardEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { TeamMembersList } from "@/components/team-members-list";
import { ApplicationDetails } from "@/components/application-details";
import { ReviewsSection } from "@/components/reviews-section";
import { EvaluationDialog } from "@/components/evaluation-dialog";
import { ScoreBadge } from "@/components/score-badge";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { useTeam } from "@/hooks/use-team";
import { useProfile } from "@/hooks/use-profile";
import {
  DISCIPLINE_LABELS,
  TOTAL_MAX_SCORE,
} from "@/lib/constants";
import { formatScore, scorePercent } from "@/lib/utils";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const { data: team, isLoading, error } = useTeam(teamId);
  const { data: profile } = useProfile();
  const [evalDialogOpen, setEvalDialogOpen] = useState(false);

  // Check if current user already reviewed this team
  const myEvaluation = team?.evaluations.find(
    (e) => e.reviewer_id === profile?.id
  );

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50/50">
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600">
                Greška pri učitavanju tima.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/dashboard")}
              >
                Nazad na dashboard
              </Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6 gap-1"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazad na dashboard
          </Button>

          {isLoading || !team ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{team.ime_tima}</h1>
                    <Badge
                      variant={
                        team.discipline === "fon-hackathon"
                          ? "orange"
                          : team.discipline === "gamejam"
                          ? "blue"
                          : "secondary"
                      }
                    >
                      {DISCIPLINE_LABELS[team.discipline] ?? team.discipline}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {team.clanovi.length} član
                      {team.clanovi.length !== 1 ? "ova" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {team.review_count} recenzij
                      {team.review_count === 1 ? "a" : "e"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="orange"
                  className="gap-2"
                  onClick={() => setEvalDialogOpen(true)}
                >
                  <ClipboardEdit className="h-4 w-4" />
                  {myEvaluation ? "Izmeni evaluaciju" : "Oceni tim"}
                </Button>
              </div>

              {/* Score overview */}
              {team.avg_score > 0 && (
                <Card>
                  <CardContent className="flex items-center gap-4 py-4">
                    <ScoreBadge
                      score={team.avg_score}
                      maxScore={TOTAL_MAX_SCORE}
                      className="text-lg"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Prosečan skor</span>
                        <span className="text-muted-foreground">
                          {formatScore(team.avg_score)} / {TOTAL_MAX_SCORE} (
                          {scorePercent(team.avg_score, TOTAL_MAX_SCORE)}%)
                        </span>
                      </div>
                      <Progress
                        value={Number(
                          scorePercent(team.avg_score, TOTAL_MAX_SCORE)
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main content grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left column - Members + Application */}
                <div className="space-y-6 lg:col-span-2">
                  {/* Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="h-4 w-4" />
                        Članovi tima ({team.clanovi.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TeamMembersList members={team.clanovi} />
                    </CardContent>
                  </Card>

                  {/* Application details */}
                  <ApplicationDetails team={team} />
                </div>

                {/* Right column - Reviews */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Star className="h-4 w-4" />
                        Recenzije ({team.review_count})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReviewsSection evaluations={team.evaluations} />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Evaluation Dialog */}
              <EvaluationDialog
                teamId={team.id}
                teamName={team.ime_tima}
                open={evalDialogOpen}
                onOpenChange={setEvalDialogOpen}
              />
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

