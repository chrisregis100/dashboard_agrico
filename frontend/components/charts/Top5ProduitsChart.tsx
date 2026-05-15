"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Top5ProduitsChartProps {
  data?: { nom: string; quantite: number; ca: number }[];
  isLoading: boolean;
}

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: { legend: { display: false } },
};

export function Top5ProduitsChart({ data, isLoading }: Top5ProduitsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data?.map((d) => d.nom) ?? [],
    datasets: [
      {
        label: "Quantité vendue",
        data: data?.map((d) => d.quantite) ?? [],
        backgroundColor: [
          "hsl(142, 76%, 36%)",
          "hsl(142, 60%, 50%)",
          "hsl(142, 50%, 60%)",
          "hsl(142, 40%, 70%)",
          "hsl(142, 30%, 80%)",
        ],
        borderRadius: 4,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Produits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
