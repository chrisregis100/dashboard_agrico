"use client";

import { Suspense } from "react";
import { useSummary, useCharts, useRecentSales } from "@/hooks/use-dashboard-data";
import { KpiCard } from "@/components/charts/KpiCard";
import { EvolutionChart } from "@/components/charts/EvolutionChart";
import { Top5ProduitsChart } from "@/components/charts/Top5ProduitsChart";
import { VillesChart } from "@/components/charts/VillesChart";
import { VendeursChart } from "@/components/charts/VendeursChart";
import { RecentSalesTable } from "@/components/charts/RecentSalesTable";

function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

function DashboardContent() {
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: charts, isLoading: chartsLoading } = useCharts();
  const { data: sales, isLoading: salesLoading } = useRecentSales();

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl font-bold sm:text-2xl">Tableau de bord</h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Chiffre d'affaires"
          value={summary ? formatFcfa(summary.caTotal) : "—"}
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
        <KpiCard
          title="Vendeur le plus performant"
          value={summary?.vendeurTopName ?? "—"}
          subtitle={
            summary && summary.vendeurTopCa > 0
              ? formatFcfa(summary.vendeurTopCa)
              : undefined
          }
          isLoading={summaryLoading}
        />
        <KpiCard
          title="Ville la plus rentable"
          value={summary?.villeTopName ?? "—"}
          subtitle={
            summary && summary.villeTopCa > 0
              ? formatFcfa(summary.villeTopCa)
              : undefined
          }
          isLoading={summaryLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-2">
        <EvolutionChart data={charts?.evolutionCA} isLoading={chartsLoading} />
        <Top5ProduitsChart
          data={charts?.top5Produits}
          isLoading={chartsLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-2">
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
        <div className="p-4 text-muted-foreground sm:p-6">Chargement...</div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
