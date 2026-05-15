"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger } from "nuqs";
import { apiFetch } from "@/lib/api";
import type { SalesSummary, ChartData, SalesResponse } from "@/types/api";

export function useSummary() {
  const [month] = useQueryState("month", parseAsInteger);
  const [year] = useQueryState("year", parseAsInteger);

  return useQuery({
    queryKey: ["stats", "summary", month, year],
    queryFn: () => {
      const params = new URLSearchParams();
      if (month) params.set("month", month.toString());
      if (year) params.set("year", year.toString());
      return apiFetch<SalesSummary>(`/api/stats/summary?${params}`);
    },
  });
}

export function useCharts() {
  const [year] = useQueryState("year", parseAsInteger);

  return useQuery({
    queryKey: ["stats", "charts", year],
    queryFn: () => {
      const params = new URLSearchParams();
      if (year) params.set("year", year.toString());
      return apiFetch<ChartData>(`/api/stats/charts?${params}`);
    },
  });
}

export function useRecentSales() {
  const [month] = useQueryState("month", parseAsInteger);
  const [year] = useQueryState("year", parseAsInteger);

  return useQuery({
    queryKey: ["sales", "recent", month, year],
    queryFn: () => {
      const params = new URLSearchParams();
      if (month) params.set("month", month.toString());
      if (year) params.set("year", year.toString());
      params.set("limit", "10");
      return apiFetch<SalesResponse>(`/api/sales?${params}`);
    },
  });
}
