"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EvolutionChartProps {
  data?: { month: string; ca: number }[];
  isLoading: boolean;
}

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${(ctx.parsed.y ?? 0).toLocaleString("fr-FR")} FCFA`,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `${(Number(value) / 1000).toFixed(0)}k`,
      },
    },
  },
};

export function EvolutionChart({ data, isLoading }: EvolutionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution du CA</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data?.map((d) => d.month) ?? [],
    datasets: [
      {
        label: "Chiffre d'affaires (FCFA)",
        data: data?.map((d) => d.ca) ?? [],
        borderColor: "hsl(142, 76%, 36%)",
        backgroundColor: "hsla(142, 76%, 36%, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution du CA (24 mois)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] sm:h-[250px] md:h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
