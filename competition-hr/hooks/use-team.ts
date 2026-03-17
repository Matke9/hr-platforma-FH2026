"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTeam } from "@/lib/queries/teams";

export function useTeam(id: string) {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => fetchTeam(id),
    enabled: !!id,
  });
}

