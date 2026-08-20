import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { TicketService } from '../../services/ticket.service';
import { Service } from '../../models/service.model';

interface CartItem {
  service: Service;
  quantite: number;
}

@Component({
  selector: 'app-client-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-catalogue.component.html'
})
export class ClientCatalogueComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  cart: CartItem[] = [];
  loading = false;
  submittingOrder = false;
  searchQuery = '';
  orderErrorMessage = '';
  orderSuccessMessage = '';

  constructor(
    private serviceService: ServiceService,
    private ticketService: TicketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCatalogue();
  }

  loadCatalogue(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.serviceService.getCatalogue().subscribe({
      next: (res) => {
        const all = Array.isArray(res?.data) ? res.data : ((res as any)?.data?.data || []);
        this.services = all.filter((s: Service) => s.disponibilite === 'actif');
        this.applySearch();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement catalogue', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applySearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredServices = [...this.services];
    } else {
      const q = this.searchQuery.toLowerCase().trim();
      this.filteredServices = this.services.filter(s =>
        s.libelle.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
      );
    }
    this.cdr.markForCheck();
  }

  get cartItems(): CartItem[] {
    return this.cart;
  }

  get cartTotalAmount(): number {
    return this.cart.reduce((sum, item) => sum + (item.service.prix_unitaire * item.quantite), 0);
  }

  get totalItemsCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantite, 0);
  }

  getQuantity(serviceId: number): number {
    const found = this.cart.find(item => item.service.id === serviceId);
    return found ? found.quantite : 0;
  }

  updateQuantity(service: Service, delta: number): void {
    if (delta > 0) {
      const existing = this.cart.find(item => item.service.id === service.id);
      if (existing) {
        existing.quantite += 1;
      } else {
        this.cart.push({ service, quantite: 1 });
      }
    } else if (delta < 0) {
      const existing = this.cart.find(item => item.service.id === service.id);
      if (existing) {
        if (existing.quantite > 1) {
          existing.quantite -= 1;
        } else {
          this.cart = this.cart.filter(item => item.service.id !== service.id);
        }
      }
    }
    this.cdr.markForCheck();
  }

  clearCart(): void {
    this.cart = [];
    this.cdr.markForCheck();
  }

  submitOrder(): void {
    if (this.cart.length === 0 || this.submittingOrder) return;

    this.submittingOrder = true;
    this.orderErrorMessage = '';
    this.orderSuccessMessage = '';
    this.cdr.markForCheck();

    const payload = {
      services: this.cart.map(item => ({
        service_id: item.service.id,
        quantite: item.quantite
      }))
    };

    this.ticketService.createOrder(payload).subscribe({
      next: (res) => {
        this.submittingOrder = false;
        this.orderSuccessMessage = 'Commande déposée avec succès !';
        this.cart = [];
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/client/tickets']);
        }, 1200);
      },
      error: (err) => {
        this.submittingOrder = false;
        this.orderErrorMessage = err.error?.error || err.error?.message || 'Erreur lors du dépôt de la commande.';
        this.cdr.markForCheck();
      }
    });
  }
}
