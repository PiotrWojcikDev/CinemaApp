import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { ReservationService } from 'src/app/services/reservation.service';
import { Router } from '@angular/router';
import { SeanceService } from 'src/app/services/seance.service';
import { MovieService } from 'src/app/services/movie.service';
import { Reservation } from 'src/app/interfaces/reservation';
import { UserService } from 'src/app/services/user.service';
import { JwtDecodeService } from 'src/app/services/jwt-decode.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reservation-summary',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './reservation-summary.component.html',
  styleUrls: [
    './reservation-summary.component.css',
    '../../../../styles.css'
  ],
  providers: [ReservationService, MovieService, SeanceService, UserService]
})
export class ReservationSummaryComponent {
  reservation!: Reservation;
  
  constructor(
    private reservationService: ReservationService,
    private seanceService: SeanceService,
    private movieService: MovieService,
    private userService: UserService,
    private jwtDecodeService: JwtDecodeService,
    private router: Router,
    private toast: NgToastService,
  ) {
    this.initializeReservation();
    this.getSeanceById(this.reservation.seance);
    this.getUserById(this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'))?.id);
  }

  initializeReservation() {
    this.reservation = {
      user: "Adam Nowak", 
      type: this.router.getCurrentNavigation()?.extras.state?.['type'], 
      movie: null,
      seatNumber: this.router.getCurrentNavigation()?.extras.state?.['seatNumber'], 
      finalPrice: this.router.getCurrentNavigation()?.extras.state?.['finalPrice'],
      seance:  this.router.getCurrentNavigation()?.extras.state?.['seance']
    };
  }

  addReservation() {
    const reservationObj = {
      user: this.reservation.user._id,
      type: this.reservation.type,
      seatNumber: this.reservation.seatNumber,
      finalPrice: this.reservation.finalPrice,
      seance: this.reservation.seance._id
    }

    this.reservationService.addReservation(reservationObj)
    .subscribe({
      next: (res) => {
        console.log("ok");
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
      }
    });
  }

  getSeanceById(seanceId: string) {
    this.seanceService.getSeanceById(seanceId)
    .subscribe({
      next: (res) => {
        this.reservation.seance = res.data;
        this.getMovieById(this.reservation.seance.movie);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getMovieById(movieId: string) {
    this.movieService.getMovieById(movieId)
    .subscribe({
      next: (res) => {
        this.reservation.movie = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  getUserById(userId: string) {
    this.userService.getUserById(userId)
    .subscribe({
      next: (res) => {
        this.reservation.user = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
