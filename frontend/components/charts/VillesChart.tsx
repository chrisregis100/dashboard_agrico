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

interface VillesChartProps {
  data?: { ville: string; count: number }[];
  isLoading: boolean;
}

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 0,
        autoSkip: true,
      },
    },
  },
};

export function VillesChart({ data, isLoading }: VillesChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ventes par ville</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data?.map((d) => d.ville) ?? [],
    datasets: [
      {
        label: "Nombre de ventes",
        data: data?.map((d) => d.count) ?? [],
        backgroundColor: "hsl(221, 83%, 53%)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes par ville</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] sm:h-[250px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
