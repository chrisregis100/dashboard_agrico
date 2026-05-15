"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  { value: "1", label: "Janvier" },
  { value: "2", label: "Février" },
  { value: "3", label: "Mars" },
  { value: "4", label: "Avril" },
  { value: "5", label: "Mai" },
  { value: "6", label: "Juin" },
  { value: "7", label: "Juillet" },
  { value: "8", label: "Août" },
  { value: "9", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

export function MonthYearFilter() {
  const [month, setMonth] = useQueryState("month", parseAsInteger);
  const [year, setYear] = useQueryState("year", parseAsInteger);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={month?.toString() ?? ""}
        onValueChange={(val) => setMonth(val && val !== "all" ? parseInt(val) : null)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Mois" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les mois</SelectItem>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year?.toString() ?? ""}
        onValueChange={(val) => setYear(val ? parseInt(val) : null)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Année" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
