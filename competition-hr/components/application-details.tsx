"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DISCIPLINE_LABELS } from "@/lib/constants";
import type { TeamWithDetails } from "@/types/app";

interface ApplicationDetailsProps {
  team: TeamWithDetails;
}

export function ApplicationDetails({ team }: ApplicationDetailsProps) {
  const sections = [
    { label: "Motivacija", value: team.motivacija },
    { label: "Prethodna iskustva", value: team.prethodna_iskustva },
    { label: "Rešavanje konflikata", value: team.konflikt_resenje },
    { label: "Prioriteti i vreme", value: team.prioriteti_vreme },
    { label: "Tehnologije", value: team.tehnologije },
    { label: "Iskustvo (video igre)", value: team.iskustvo_video_igre },
  ].filter((s) => s.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detalji prijave</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Discipline */}
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            Disciplina
          </span>
          <div className="mt-1">
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
        </div>

        {/* Kako ste čuli */}
        {team.kako_ste_culi && team.kako_ste_culi.length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Kako ste čuli za takmičenje
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {team.kako_ste_culi.map((item) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Application text sections */}
        {sections.map((section, index) => (
          <div key={section.label}>
            {index > 0 && <Separator className="mb-4" />}
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                {section.label}
              </span>
              <p className="mt-1 text-sm whitespace-pre-wrap">
                {section.value}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

