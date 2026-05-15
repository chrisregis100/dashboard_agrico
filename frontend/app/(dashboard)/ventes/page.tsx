"use client";

import { Suspense } from "react";
import { SaleForm } from "@/components/forms/SaleForm";

export default function VentesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-muted-foreground">Chargement...</div>
      }
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Saisie des ventes</h1>
        <SaleForm />
      </div>
    </Suspense>
  );
}
