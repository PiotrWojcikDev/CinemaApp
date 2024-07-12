import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { SeanceService } from 'src/app/services/seance.service';
import { AddSeanceDialogComponent } from 'src/app/components/dialogs/add-seance-dialog/add-seance-dialog.component';
import { JwtDecodeService } from 'src/app/services/jwt-decode.service';
import { UpdateSeancePriceDialogComponent } from 'src/app/components/dialogs/update-seance-price-dialog/update-seance-price-dialog.component';

@Component({
  selector: 'app-seances',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AddSeanceDialogComponent, UpdateSeancePriceDialogComponent],
  templateUrl: './seances.component.html',
  styleUrls: [
    './seances.component.css',
    '../../../../styles.css'
  ],
  providers: [SeanceService]
})
export class SeancesComponent {
  userRole = null;
  seanceToUpdate: any = null;
  allSeances: Array<any> = [];
  isAscendingSort: boolean = true; // Określa kierunek sortowania
  sortColumn: string = 'movie'; // Kolumna, po której aktualnie sortujemy

  
  constructor(
    public seanceService: SeanceService,
    private changeDetectorRef: ChangeDetectorRef,
    private jwtDecodeService: JwtDecodeService
  ) {
    this.userRole = this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'))?.role;  
    this.getAllSeances();
  }


  getAllSeances() {
    this.seanceService.getAllSeances()
    .subscribe({
      next: (res) => {
        this.allSeances = res.data;
        console.log(this.allSeances);
      },
      error: (err) => {
        console.log(err);
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

  updateSeancePrice(seanceObj: any) {
    this.seanceToUpdate = seanceObj;
    this.seanceService.showUpdateSeancePriceDialog = true;
  }

  toggleSortDirection() {
    this.isAscendingSort = !this.isAscendingSort;
    this.sortSeances();
    this.changeDetectorRef.detectChanges(); // Odśwież widok
  }

  sortSeances() {
    this.allSeances.sort((a, b) => {
      const valueA = this.getColumnValue(a, this.sortColumn);
      const valueB = this.getColumnValue(b, this.sortColumn);

      if (valueA < valueB) {
        return this.isAscendingSort ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.isAscendingSort ? 1 : -1;
      }
      return 0;
    });
  }

  // Funkcja do pobierania wartości kolumny
  getColumnValue(seance: any, column: string): any {
    switch (column) {
      case 'movie':
        return seance.movie.title.toLowerCase();
      case 'date':
        return new Date(seance.dateOfSeance);
      case 'room':
        return seance.room;
      default:
        return null;
    }
  }

  // Funkcja do zmiany kolumny, po której sortujemy
  changeSortColumn(column: string) {
    if (this.sortColumn === column) {
      this.toggleSortDirection();
    } else {
      this.sortColumn = column;
      this.isAscendingSort = true;
    }
    this.sortSeances();
  }
}
