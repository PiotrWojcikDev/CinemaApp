import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-add-movie-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-movie-dialog.component.html',
  styleUrls: [
    './add-movie-dialog.component.css',
    '../../../../styles.css'
  ]
})
export class AddMovieDialogComponent {
  movieGenres = ["Komedia", "Thriller", "Dramat", "Przygodowy", "Western", "Sci-Fi", "Akcja"];
  isFileExtensionCorrect = true;
  addMovieForm!: FormGroup;

  constructor(
    public movieService: MovieService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private toast: NgToastService, 
  ) { }

  ngOnInit(): void {
    this.addMovieForm = this.formBuilder.group({
      title: ['', Validators.required],
      yearOfProduction: ['', Validators.required],
      director: ['', Validators.required],
      description: ['', Validators.required],
      movieGenre: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  addMovie() {    
    this.movieService.showAddMovieDialog = false;    

    var formData: any = this.createFormData();

    this.movieService.addMovie(formData)
    .subscribe({
      next: (res) => {
        this.addMovieForm.reset();      
        this.refreshComponent();
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
      }
    });
  }
 
  validateExtension(event: any) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg'];
    const selectedFile = event.target.files[0];

    if (selectedFile) {
        const fileName = selectedFile.name;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();

        if (fileExtension && allowedExtensions.includes(fileExtension)) {
            console.log('Poprawne rozszerzenie pliku: ' + fileExtension);
            this.addMovieForm.controls['image'].setValue(selectedFile);
            this.isFileExtensionCorrect = true;
        } else {
            this.isFileExtensionCorrect = false;
        }
    }
  }

  createFormData() {
    var formData: any = new FormData();
    formData.append('title', this.addMovieForm.get('title')?.value);
    formData.append('yearOfProduction', this.addMovieForm.get('yearOfProduction')?.value);
    formData.append('director', this.addMovieForm.get('director')?.value);
    formData.append('description', this.addMovieForm.get('description')?.value);
    formData.append('movieGenre', this.addMovieForm.get('movieGenre')?.value);
    formData.append('image', this.addMovieForm.get('image')?.value);

    return formData;
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
