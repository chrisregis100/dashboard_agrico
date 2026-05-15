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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Vendeur</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((vente) => (
              <TableRow key={vente.id}>
                <TableCell>
                  {new Date(vente.dateVente).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>{vente.produit.nom}</TableCell>
                <TableCell>
                  {vente.client.prenom} {vente.client.nom}
                </TableCell>
                <TableCell>{vente.vendeur.name}</TableCell>
                <TableCell className="text-right">{vente.quantite}</TableCell>
                <TableCell className="text-right">
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
