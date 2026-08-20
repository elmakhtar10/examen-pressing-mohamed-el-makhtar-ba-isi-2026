export interface DailyKpis {
  tickets_created_today: number;
  tickets_retrieved_today: number;
  daily_revenue: number;
}

export interface MonthlyTicketData {
  month: number;
  total: number;
}

export interface RevenueByServiceData {
  service_id: number;
  service_libelle?: string;
  service_nom?: string;
  total_revenue: number;
  total_quantity: number;
}

export interface TicketSummary {
  id: number;
  code: string;
  client_nom?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
  };
  created_at: string;
  montant_total: number;
  is_paid: boolean;
  statut: 'recu' | 'reçu' | 'en_traitement' | 'pret' | 'recupere' | 'annule';
}

