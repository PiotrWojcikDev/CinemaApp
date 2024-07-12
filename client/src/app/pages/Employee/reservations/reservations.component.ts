import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbars/navbar/navbar.component';
import { ReservationService } from '../../../services/reservation.service';
import { Router } from '@angular/router';
import { ReservationDeleteConfirmationModalComponent } from '../../../components/modals/reservation-delete-confirmation-modal/reservation-delete-confirmation-modal.component';
import { NgxSpinnerModule, NgxSpinnerService  } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    ReservationDeleteConfirmationModalComponent, 
    NgxSpinnerModule,
     
  ],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  providers: [ReservationService ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class ReservationsComponent {
  reservationToDelete: any;
  allReservations: Array<any>= [];


  constructor(
    public reservationService: ReservationService,
    private router: Router,
    private loadingSpinner: NgxSpinnerService
  ) {
    this.getAllReservations();
  }
  ngAfterViewInit(): void { this.loadingSpinner.show(); }
  

  getAllReservations() {
    
    this.reservationService.getAllReservations()
    .subscribe({
      next: (res) => {
        this.loadingSpinner.hide();
        this.allReservations = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  deleteReservation(reservation: any) {
    this.reservationToDelete = reservation;
    this.reservationService.showReservationDeleteConfirmationModal = true;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
  
    const formattedDate = `${day}-${month}-${year} ${hour}:${minute}`;
  
    return formattedDate;
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
