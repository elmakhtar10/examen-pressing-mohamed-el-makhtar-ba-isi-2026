import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../services/service.service';
import { Service, CreateServiceData } from '../../models/service.model';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services-list.component.html'
})
export class ServicesListComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  loading = false;
  searchQuery = '';
  statusFilter = 'all';

  showModal = false;
  isEditing = false;
  selectedServiceId: number | null = null;
  formSubmitLoading = false;
  modalErrorMessage = '';
  successBannerMessage = '';

  formData: CreateServiceData = {
    libelle: '',
    prix_unitaire: 0,
    description: '',
    disponibilite: 'actif'
  };

  constructor(
    private serviceService: ServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.serviceService.getCatalogue().subscribe({
      next: (res) => {
        const raw = Array.isArray(res?.data) ? res.data : ((res as any)?.data?.data || []);
        this.services = raw;
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement services', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    let result = [...this.services];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(s => s.libelle.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)));
    }

    if (this.statusFilter !== 'all') {
      result = result.filter(s => s.disponibilite === this.statusFilter);
    }

    this.filteredServices = result;
    this.cdr.markForCheck();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.selectedServiceId = null;
    this.formData = { libelle: '', prix_unitaire: 0, description: '', disponibilite: 'actif' };
    this.modalErrorMessage = '';
    this.showModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(service: Service): void {
    this.isEditing = true;
    this.selectedServiceId = service.id;
    this.formData = {
      libelle: service.libelle,
      prix_unitaire: service.prix_unitaire,
      description: service.description || '',
      disponibilite: service.disponibilite
    };
    this.modalErrorMessage = '';
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  saveService(): void {
    if (this.formSubmitLoading) return;

    if (!this.formData.libelle || !this.formData.prix_unitaire) {
      this.modalErrorMessage = 'Veuillez renseigner au moins le libellé et le prix unitaire.';
      this.cdr.markForCheck();
      return;
    }

    this.formSubmitLoading = true;
    this.modalErrorMessage = '';
    this.cdr.markForCheck();

    const payload = {
      libelle: this.formData.libelle,
      prix_unitaire: Number(this.formData.prix_unitaire),
      description: this.formData.description?.trim() || 'Service de pressing',
      disponibilite: this.formData.disponibilite || 'actif'
    };

    if (this.isEditing && this.selectedServiceId) {
      this.serviceService.updateService(this.selectedServiceId, payload).subscribe({
        next: (res) => {
          this.formSubmitLoading = false;
          this.showModal = false;
          this.successBannerMessage = res?.message || 'Service modifié avec succès.';
          this.loadServices();
          this.cdr.markForCheck();
          setTimeout(() => {
            this.successBannerMessage = '';
            this.cdr.markForCheck();
          }, 4000);
        },
        error: (err) => {
          this.formSubmitLoading = false;
          this.modalErrorMessage = err.error?.message || 'Erreur lors de la modification du service.';
          this.cdr.markForCheck();
        }
      });
    } else {
      this.serviceService.createService(payload).subscribe({
        next: (res) => {
          this.formSubmitLoading = false;
          this.showModal = false;
          this.successBannerMessage = res?.message || 'Service créé avec succès.';
          this.loadServices();
          this.cdr.markForCheck();
          setTimeout(() => {
            this.successBannerMessage = '';
            this.cdr.markForCheck();
          }, 4000);
        },
        error: (err) => {
          this.formSubmitLoading = false;
          this.modalErrorMessage = err.error?.message || 'Erreur lors de la création du service.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  toggleAvailability(service: Service): void {
    this.serviceService.toggleAvailability(service.id, service.disponibilite).subscribe({
      next: () => this.loadServices(),
      error: (err) => console.error('Erreur changement disponibilité', err)
    });
  }

  deleteService(service: Service): void {
    if (confirm(`Voulez-vous vraiment supprimer le service "${service.libelle}" ?`)) {
      this.serviceService.deleteService(service.id).subscribe({
        next: () => this.loadServices(),
        error: (err) => console.error('Erreur suppression service', err)
      });
    }
  }
}
