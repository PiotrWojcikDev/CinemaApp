import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeanceService } from 'src/app/services/seance.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-update-seance-price-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-seance-price-dialog.component.html',
  styleUrls: [
    './update-seance-price-dialog.component.css',
    '../../../../styles.css'
  ]
})
export class UpdateSeancePriceDialogComponent {
  @Input() seanceObj: any;

  updateSeanceForm!: FormGroup;

  constructor(
    public seanceService: SeanceService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private toast: NgToastService, 
  ) { }

  ngOnInit(): void {
    this.updateSeanceForm = this.formBuilder.group({
      price: ['', Validators.required]
    })
  }

  updateSeancePrice() {
    this.seanceObj.price = this.updateSeanceForm.get('price')?.value;
    this.seanceService.updateSeancePrice(this.seanceObj)
    .subscribe({
      next: (res) => {
        this.seanceService.showUpdateSeancePriceDialog = false;
        this.refreshComponent();
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
      }
    });
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
