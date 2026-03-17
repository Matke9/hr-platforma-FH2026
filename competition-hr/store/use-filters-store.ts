import { create } from "zustand";
import type { FiltersState } from "@/types/app";

export const useFiltersStore = create<FiltersState>((set) => ({
  search: "",
  discipline: "all",
  status: "all",
  sortBy: "newest",
  setSearch: (search) => set({ search }),
  setDiscipline: (discipline) => set({ discipline }),
  setStatus: (status) => set({ status }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () =>
    set({ search: "", discipline: "all", status: "all", sortBy: "newest" }),
}));

