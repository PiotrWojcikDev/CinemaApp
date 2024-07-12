import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../services/reservation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-delete-confirmation-modal.component.html',
  styleUrls: [
    './reservation-delete-confirmation-modal.component.css',
    '../../../../styles.css'
  ]
})
export class ReservationDeleteConfirmationModalComponent {
  @Input() reservationObj: any;


  constructor(
    public reservationService: ReservationService,
    private router: Router
  ) { }

  deleteReservation() {
    console.log(JSON.stringify(this.reservationObj))
    this.reservationService.deleteReservation(this.reservationObj)
    .subscribe({
      next: (res) => {
        console.log("ok")
        this.refreshComponent();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  async refreshComponent() {
    const currentUrl = this.router.url;
    try {
      await this.router.navigateByUrl('/', { skipLocationChange: true });
      await this.router.navigate([currentUrl]);
    } catch (error) {
      console.error('Błąd podczas odświeżania komponentu:', error);
    }
  }
}
