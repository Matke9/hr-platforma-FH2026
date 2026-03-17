"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/lib/queries/teams";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 2,
  });
}

