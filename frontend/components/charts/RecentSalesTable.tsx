"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Vente } from "@/types/api";

interface RecentSalesTableProps {
  data?: Vente[];
  isLoading: boolean;
}

export function RecentSalesTable({ data, isLoading }: RecentSalesTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dernières ventes</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="mb-2 h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dernières ventes</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead className="hidden sm:table-cell">Client</TableHead>
              <TableHead className="hidden md:table-cell">Vendeur</TableHead>
              <TableHead className="text-right">Qté</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((vente) => (
              <TableRow key={vente.id}>
                <TableCell className="whitespace-nowrap">
                  {new Date(vente.dateVente).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell className="max-w-[120px] truncate sm:max-w-none">
                  {vente.produit.nom}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {vente.client.prenom} {vente.client.nom}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {vente.vendeur.name}
                </TableCell>
                <TableCell className="text-right">{vente.quantite}</TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {vente.montantTotal.toLocaleString("fr-FR")} FCFA
                </TableCell>
              </TableRow>
            ))}
            {(!data || data.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Aucune vente trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
