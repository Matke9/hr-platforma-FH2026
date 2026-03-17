"use client";

import React, { useMemo } from "react";
import { Users, Star, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamCard } from "@/components/team-card";
import { TeamFilters } from "@/components/team-filters";
import { useTeams } from "@/hooks/use-teams";
import { useFiltersStore } from "@/store/use-filters-store";
import { formatScore } from "@/lib/utils";
import { TOTAL_MAX_SCORE } from "@/lib/constants";
import type { TeamWithDetails } from "@/types/app";

export default function DashboardPage() {
  const { data: teams, isLoading, error } = useTeams();
  const { search, discipline, status, sortBy } = useFiltersStore();

  // Filtered and sorted teams
  const filteredTeams = useMemo(() => {
    if (!teams) return [];

    let result = [...teams];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.ime_tima.toLowerCase().includes(q) ||
          t.clanovi.some((c) => c.ime_prezime.toLowerCase().includes(q))
      );
    }

    // Discipline filter
    if (discipline !== "all") {
      result = result.filter((t) => t.discipline === discipline);
    }

    // Status filter
    if (status === "reviewed") {
      result = result.filter((t) => t.review_count > 0);
    } else if (status === "unreviewed") {
      result = result.filter((t) => t.review_count === 0);
    }

    // Sort
    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "score-high":
        result.sort((a, b) => b.avg_score - a.avg_score);
        break;
      case "score-low":
        result.sort((a, b) => a.avg_score - b.avg_score);
        break;
      case "name-asc":
        result.sort((a, b) => a.ime_tima.localeCompare(b.ime_tima));
        break;
      case "name-desc":
        result.sort((a, b) => b.ime_tima.localeCompare(a.ime_tima));
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [teams, search, discipline, status, sortBy]);

  // Stats
  const stats = useMemo(() => {
    if (!teams)
      return { total: 0, reviewed: 0, avgScore: 0 };

    const reviewed = teams.filter((t) => t.review_count > 0);
    const avgScore =
      reviewed.length > 0
        ? reviewed.reduce((sum, t) => sum + t.avg_score, 0) / reviewed.length
        : 0;

    return {
      total: teams.length,
      reviewed: reviewed.length,
      avgScore,
    };
  }, [teams]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">
          Greška pri učitavanju timova. Pokušajte ponovo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Pregled i evaluacija prijavljenih timova
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ukupno timova
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Recenzirani
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats.reviewed}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {stats.total}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Prosečan skor
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formatScore(stats.avgScore)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / {TOTAL_MAX_SCORE}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <TeamFilters />

      {/* Team grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="space-y-3">
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Nema rezultata</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pokušajte da promenite filtere ili pretražite ponovo.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      {/* Results count */}
      {!isLoading && filteredTeams.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Prikazano {filteredTeams.length} od {teams?.length ?? 0} timova
        </p>
      )}
    </div>
  );
}

