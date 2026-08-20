import { Service } from './service.model';
import { User } from './user.model';

export type TicketStatus = 'recu' | 'reçu' | 'en_traitement' | 'pret' | 'recupere' | 'annule';

export interface TicketServiceLine {
  id?: number;
  ticket_id?: number;
  service_id: number;
  quantite: number;
  prix_unitaire?: number;
  service?: Service;
}

export interface Ticket {
  id: number;
  code: string;
  user_id: number;
  statut: TicketStatus;
  montant_total: number;
  is_paid: boolean;
  created_at: string;
  updated_at?: string;
  user?: User;
  client_nom?: string;
  services?: TicketServiceLine[];
  paiements?: any[];
}

export interface CreateOrderItem {
  service_id: number;
  quantite: number;
}

export interface CreateOrderPayload {
  services: CreateOrderItem[];
}
