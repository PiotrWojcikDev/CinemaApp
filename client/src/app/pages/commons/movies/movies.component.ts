import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../services/movie.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtDecodeService } from '../../../services/jwt-decode.service';
import { NavbarComponent } from '../../../components/navbars/navbar/navbar.component';
import { AddMovieDialogComponent } from '../../../components/dialogs/add-movie-dialog/add-movie-dialog.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NavbarComponent, AddMovieDialogComponent, RouterModule],
  templateUrl: './movies.component.html',
  styleUrls: [
    './movies.component.css',
    '../../../../styles.css'
],
  providers: [MovieService, JwtDecodeService]
})
export class MoviesComponent {
  allMovies: any[] = [];
  userRole = null;


  constructor(
    public movieService: MovieService,
    private jwtDecodeService: JwtDecodeService,
    private router: Router,
    private toast: NgToastService,
  ) {
    this.userRole = this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'))?.role;  
    this.getAllMovies();
  }

  getAllMovies() {
    this.movieService.getAllMovies()
    .subscribe({
      next: (res) => {
        this.allMovies = res.data;
        console.log(this.allMovies)
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
      }
    });
  }
  
  showMovieSeances(movieId: string) {
    this.router.navigate([`movies/${movieId}/seances`]);
  }
}
