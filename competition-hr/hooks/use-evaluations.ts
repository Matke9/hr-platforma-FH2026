"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitEvaluation } from "@/lib/queries/evaluations";

export function useSubmitEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitEvaluation,
    onSuccess: (_data, variables) => {
      // Invalidate the team detail + team list queries
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

