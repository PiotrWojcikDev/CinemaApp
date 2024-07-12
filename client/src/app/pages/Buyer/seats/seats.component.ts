import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { SeatButtonComponent } from 'src/app/components/seat-button/seat-button.component';
import { SeanceService } from 'src/app/services/seance.service';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SeatButtonComponent, RouterModule],
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.css'],
  providers: [SeanceService, ReservationService]
})
export class SeatsComponent {
    selectedSeat: number = 0;
    reservedSeats: Array<any> = [];
    seanceId: string = "";
    dataForReservation: any;
    

    constructor(
      private seanceService: SeanceService,
      private router: Router,
      private route: ActivatedRoute,
    ) {
      this.seanceId = this.route.snapshot.params['id'];
      this.getReservedSeatsForSeance(this.seanceId);
      this.dataForReservation = this.router.getCurrentNavigation()?.extras.state;
    }
  
    getReservedSeatsForSeance(seanceId: string) {
      this.seanceService.getReservedSeatsForSeance(seanceId)
      .subscribe({
        next: (res) => {
          this.reservedSeats = res.data;
          console.log(this.reservedSeats)
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    
    receiveSelectedSeat(selectedSeat: number) {
      this.selectedSeat = selectedSeat;
      console.log(this.selectedSeat);
    }

    onSubmit() {
      const dataForReservation = {
        type: this.dataForReservation.type,
        seatNumber: this.selectedSeat,
        finalPrice: this.dataForReservation.finalPrice,
        seance: this.seanceId
      }
      this.router.navigate(['reservationSummary'], { state: dataForReservation });
    }
}
