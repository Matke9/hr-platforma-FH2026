"use client";

import React from "react";
import Link from "next/link";
import { Users, Star, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScoreBadge } from "@/components/score-badge";
import { DISCIPLINE_LABELS, TOTAL_MAX_SCORE } from "@/lib/constants";
import { formatScore, scorePercent } from "@/lib/utils";
import type { TeamWithDetails } from "@/types/app";

interface TeamCardProps {
  team: TeamWithDetails;
}

export function TeamCard({ team }: TeamCardProps) {
  const disciplineLabel =
    DISCIPLINE_LABELS[team.discipline] ?? team.discipline;

  const percent = team.avg_score
    ? Number(scorePercent(team.avg_score, TOTAL_MAX_SCORE))
    : 0;

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{team.ime_tima}</CardTitle>
            <Badge
              variant={
                team.discipline === "fon-hackathon"
                  ? "orange"
                  : team.discipline === "gamejam"
                  ? "blue"
                  : "secondary"
              }
            >
              {disciplineLabel}
            </Badge>
          </div>
          <ScoreBadge score={team.avg_score} maxScore={TOTAL_MAX_SCORE} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Members count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {team.clanovi.length} član{team.clanovi.length !== 1 ? "ova" : ""}
          </span>
        </div>

        {/* Reviews count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4" />
          <span>
            {team.review_count} recenzij
            {team.review_count === 1 ? "a" : "e"}
          </span>
        </div>

        {/* Score progress bar */}
        {team.avg_score > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Prosečan skor</span>
              <span>
                {formatScore(team.avg_score)} / {TOTAL_MAX_SCORE}
              </span>
            </div>
            <Progress value={percent} />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="ghost" className="ml-auto gap-1" size="sm">
          <Link href={`/teams/${team.id}`}>
            Pregledaj
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

