"use client";

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFiltersStore } from "@/store/use-filters-store";
import { SORT_OPTIONS } from "@/lib/constants";

export function TeamFilters() {
  const {
    search,
    discipline,
    status,
    sortBy,
    setSearch,
    setDiscipline,
    setStatus,
    setSortBy,
    resetFilters,
  } = useFiltersStore();

  const hasActiveFilters =
    search !== "" ||
    discipline !== "all" ||
    status !== "all" ||
    sortBy !== "newest";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pretraži timove..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Discipline filter */}
        <Select value={discipline} onValueChange={setDiscipline}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Disciplina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sve discipline</SelectItem>
            <SelectItem value="fon-hackathon">FON Hackathon</SelectItem>
            <SelectItem value="gamejam">GameJam</SelectItem>
            <SelectItem value="blockchain">Blockchain</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Svi statusi</SelectItem>
            <SelectItem value="reviewed">Recenzirani</SelectItem>
            <SelectItem value="unreviewed">Nerecenzirani</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sortiraj" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            title="Resetuj filtere"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

