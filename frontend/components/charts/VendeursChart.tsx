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

interface VendeursChartProps {
  data?: { nom: string; count: number; ca: number }[];
  isLoading: boolean;
}

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

export function VendeursChart({ data, isLoading }: VendeursChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance vendeurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data?.map((d) => d.nom) ?? [],
    datasets: [
      {
        label: "Nombre de ventes",
        data: data?.map((d) => d.count) ?? [],
        backgroundColor: "hsl(262, 83%, 58%)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance vendeurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
