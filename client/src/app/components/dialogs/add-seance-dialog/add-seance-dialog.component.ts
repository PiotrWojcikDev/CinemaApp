import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeanceService } from 'src/app/services/seance.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-seance-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-seance-dialog.component.html',
  styleUrls: [
    './add-seance-dialog.component.css',
    '../../../../styles.css'
  ],
  providers: [MovieService]
})
export class AddSeanceDialogComponent implements OnInit {
  
  allMovies: Array<any> = [];
  addSeanceForm!: FormGroup;

  constructor(
    public seanceService: SeanceService, 
    private movieService: MovieService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
  ) { 
    this.getAllMovies();
  }

  ngOnInit(): void {
    this.addSeanceForm = this.formBuilder.group({
      movie: ['', Validators.required],
      dateOfSeance: ['', Validators.required],
      time: ['', Validators.required],
      room: ['', Validators.required]
    });
  }

  getAllMovies() {
    this.movieService.getAllMovies()
    .subscribe({
      next: (res) => {
        this.allMovies = res.data;
        console.log(this.allMovies)
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addSeance() {
    this.seanceService.addSeance(this.addSeanceForm.value)
    .subscribe({
      next: (res) => {
        this.seanceService.showAddSeanceDialog = false;
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
