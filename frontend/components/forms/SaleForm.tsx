"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Produit, Client } from "@/types/api";

const saleSchema = z.object({
  produitId: z.string().min(1, "Sélectionnez un produit"),
  clientId: z.string().min(1, "Sélectionnez un client"),
  quantite: z.number().int().positive("La quantité doit être positive"),
  dateVente: z.string().min(1, "Sélectionnez une date"),
});

type SaleFormData = z.infer<typeof saleSchema>;

export function SaleForm() {
  const queryClient = useQueryClient();
  const [previewAmount, setPreviewAmount] = useState<number | null>(null);

  const { data: produits } = useQuery({
    queryKey: ["produits"],
    queryFn: () => apiFetch<Produit[]>("/api/produits"),
  });

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => apiFetch<Client[]>("/api/clients"),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      produitId: "",
      clientId: "",
      quantite: 1,
      dateVente: new Date().toISOString().split("T")[0],
    },
  });

  const selectedProduitId = watch("produitId");
  const quantite = watch("quantite");

  useEffect(() => {
    if (selectedProduitId && quantite > 0 && produits) {
      const produit = produits.find((p) => p.id === selectedProduitId);
      if (produit) {
        setPreviewAmount(quantite * produit.prixUnitaire);
        return;
      }
    }
    setPreviewAmount(null);
  }, [selectedProduitId, quantite, produits]);

  const mutation = useMutation({
    mutationFn: (data: SaleFormData) =>
      apiFetch("/api/sales", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          dateVente: new Date(data.dateVente).toISOString(),
        }),
      }),
    onSuccess: () => {
      toast.success("Vente enregistrée avec succès !");
      reset();
      setPreviewAmount(null);
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });

  const onSubmit = (data: SaleFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Nouvelle vente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="produitId">Produit</Label>
            <Select
              value={selectedProduitId}
              onValueChange={(val) => setValue("produitId", val ?? "")}
            >
              <SelectTrigger id="produitId">
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {produits?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nom} — {p.prixUnitaire.toLocaleString("fr-FR")} FCFA/unité
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.produitId && (
              <p className="text-sm text-destructive">
                {errors.produitId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={watch("clientId")}
              onValueChange={(val) => setValue("clientId", val ?? "")}
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.prenom} {c.nom} — {c.ville}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-sm text-destructive">
                {errors.clientId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantite">Quantité</Label>
            <Input
              id="quantite"
              type="number"
              min={1}
              {...register("quantite", { valueAsNumber: true })}
              placeholder="Ex: 50"
            />
            {errors.quantite && (
              <p className="text-sm text-destructive">
                {errors.quantite.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateVente">Date de vente</Label>
            <Input id="dateVente" type="date" {...register("dateVente")} />
            {errors.dateVente && (
              <p className="text-sm text-destructive">
                {errors.dateVente.message}
              </p>
            )}
          </div>

          {previewAmount !== null && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Montant total estimé
              </p>
              <p className="text-2xl font-bold text-primary">
                {previewAmount.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enregistrement..." : "Enregistrer la vente"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
