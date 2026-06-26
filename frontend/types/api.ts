export interface SalesSummary {
  caTotal: number;
  nbVentes: number;
  produitTopName: string;
  vendeurTopName: string;
  vendeurTopCa: number;
  villeTopName: string;
  villeTopCa: number;
  trendVsPrevMonth: number;
}

export interface ChartData {
  evolutionCA: { month: string; ca: number }[];
  top5Produits: { nom: string; quantite: number; ca: number }[];
  ventesParVille: { ville: string; count: number }[];
  ventesParVendeur: { nom: string; count: number; ca: number }[];
}

export interface Vente {
  id: string;
  produitId: string;
  vendeurId: string;
  clientId: string;
  quantite: number;
  dateVente: string;
  montantTotal: number;
  createdAt: string;
  produit: { nom: string; categorie: string };
  vendeur: { name: string };
  client: { nom: string; prenom: string; ville: string };
}

export interface SalesResponse {
  data: Vente[];
  total: number;
  page: number;
  limit: number;
}

export interface Produit {
  id: string;
  nom: string;
  categorie: string;
  prixUnitaire: number;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  ville: string;
}
