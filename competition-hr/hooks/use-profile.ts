"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMyProfile } from "@/lib/queries/profiles";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5,
  });
}

