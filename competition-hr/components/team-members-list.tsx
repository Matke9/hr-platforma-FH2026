"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  FileText,
  Crown,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getInitials, getAvatarColor } from "@/lib/utils";
import type { Clan } from "@/types/database";

interface TeamMembersListProps {
  members: Clan[];
}

export function TeamMembersList({ members }: TeamMembersListProps) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nema prijavljenih članova.</p>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member, index) => (
        <div key={member.id}>
          {index > 0 && <Separator className="mb-4" />}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback
                className={`${getAvatarColor(member.ime_prezime)} text-white`}
              >
                {getInitials(member.ime_prezime)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{member.ime_prezime}</h4>
                {member.kapiten && (
                  <Badge variant="orange" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Kapiten
                  </Badge>
                )}
              </div>

              <div className="grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-foreground hover:underline"
                  >
                    {member.email}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{member.telefon}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {member.grad}, {member.godine} god.
                  </span>
                </div>
                {member.firma && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{member.firma}</span>
                  </div>
                )}
                {member.fakultet_skola && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>
                      {member.fakultet_skola}
                      {member.godina_studija
                        ? ` (${member.godina_studija})`
                        : ""}
                    </span>
                  </div>
                )}
                {member.srednja_skola && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>
                      {member.srednja_skola}
                      {member.godina_skolovanja
                        ? ` (${member.godina_skolovanja})`
                        : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Status tags */}
              {member.status && member.status.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.status.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex gap-3">
                {member.cv_link && (
                  <a
                    href={member.cv_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline"
                  >
                    <FileText className="h-3 w-3" />
                    CV
                  </a>
                )}
                {member.github_link && (
                  <a
                    href={member.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline"
                  >
                    <Github className="h-3 w-3" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

