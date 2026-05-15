"use client";

import { Suspense } from "react";
import { useSummary, useCharts, useRecentSales } from "@/hooks/use-dashboard-data";
import { KpiCard } from "@/components/charts/KpiCard";
import { EvolutionChart } from "@/components/charts/EvolutionChart";
import { Top5ProduitsChart } from "@/components/charts/Top5ProduitsChart";
import { VillesChart } from "@/components/charts/VillesChart";
import { VendeursChart } from "@/components/charts/VendeursChart";
import { RecentSalesTable } from "@/components/charts/RecentSalesTable";

function DashboardContent() {
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: charts, isLoading: chartsLoading } = useCharts();
  const { data: sales, isLoading: salesLoading } = useRecentSales();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Chiffre d'affaires"
          value={
            summary ? `${summary.caTotal.toLocaleString("fr-FR")} FCFA` : "—"
          }
          trend={summary?.trendVsPrevMonth}
          isLoading={summaryLoading}
        />
        <KpiCard
          title="Nombre de ventes"
          value={summary ? summary.nbVentes.toString() : "—"}
          isLoading={summaryLoading}
        />
        <KpiCard
          title="Produit le plus vendu"
          value={summary?.produitTopName ?? "—"}
          isLoading={summaryLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EvolutionChart data={charts?.evolutionCA} isLoading={chartsLoading} />
        <Top5ProduitsChart
          data={charts?.top5Produits}
          isLoading={chartsLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <VillesChart data={charts?.ventesParVille} isLoading={chartsLoading} />
        <VendeursChart
          data={charts?.ventesParVendeur}
          isLoading={chartsLoading}
        />
      </div>

      <RecentSalesTable data={sales?.data} isLoading={salesLoading} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-muted-foreground">Chargement...</div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
