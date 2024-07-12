import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeanceService } from 'src/app/services/seance.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-movie-seances',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './movie-seances.component.html',
  styleUrls: [
    './movie-seances.component.css',
    '../../../../styles.css'
],
  providers: [MovieService, SeanceService, ReservationService]
})
export class MovieSeancesComponent {

  movie: any;
  movieId: string = "";
  movieSeances: Array<any> = []; 
  seance: any;
  seanceId: string = "";
  type: any;
  typesOfReservations = ["Normalny", "Ulgowy"];
  coefficientOfTypeOfReservation: any = [1, 0.8];
  selectedTypeOfReservation: number = 0;
  finalPrice: number | undefined;
  
  constructor(
    private movieService: MovieService,
    private seanceService: SeanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.movieId = this.route.snapshot.params['id'];
    console.log(this.movieId)
    this.getMovieSeances(this.movieId);
    this.getMovieById(this.movieId);
  }
    
  getMovieById(movieId: any) {
    this.movieService.getMovieById(movieId)
    .subscribe({
      next: (res) => {
        this.movie = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getSeanceById(seanceId: string) {
    this.seanceService.getSeanceById(seanceId)
    .subscribe({
      next: (res) => {
        this.seance = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getMovieSeances(movieId: string) {
    const currentDate = new Date();

    this.movieService.getMovieSeances(movieId)
      .subscribe({
        next: (res) => {
          // Filtruj seanse, pozostawiając tylko te w przyszłości
          this.movieSeances = res.data.filter((seance: any) => {
            const seanceDate = new Date(seance.dateOfSeance); // Przyjmuję, że istnieje pole 'date' w obiekcie seansu
            return seanceDate > currentDate;
          });

          console.log(this.movieSeances);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  onSelectSeance(event: any) {
    this.seanceId = event.target.value;
    this.getSeanceById(this.seanceId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    const dayOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][date.getDay()];

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
  
    const formattedDate = ` ${day}-${month}-${year} ${dayOfWeek}, ${hour}:${minute}`;
  
    return formattedDate;
  }

  getFinalPrice(price: number) {
    return (price * this.coefficientOfTypeOfReservation[this.selectedTypeOfReservation]).toFixed(2);
  }
  
  onSubmit(finalPrice: number) {
    this.type = this.typesOfReservations[this.selectedTypeOfReservation];
    this.finalPrice = finalPrice;
    const dataForReservation = {
      type: this.type, 
      finalPrice: this.finalPrice
    }
    this.router.navigate([`seances/${this.seanceId}/seats`], { state: dataForReservation })
  }
}
