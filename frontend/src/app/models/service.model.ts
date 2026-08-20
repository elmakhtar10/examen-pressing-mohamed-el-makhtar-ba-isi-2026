export interface Service {
  id: number;
  libelle: string;
  prix_unitaire: number;
  description: string;
  disponibilite: 'actif' | 'inactif';
  created_at?: string;
  updated_at?: string;
}

export interface CreateServiceData {
  libelle: string;
  prix_unitaire: number;
  description: string;
  disponibilite?: 'actif' | 'inactif';
}

export interface UpdateServiceData {
  libelle?: string;
  prix_unitaire?: number;
  description?: string;
  disponibilite?: 'actif' | 'inactif';
}
