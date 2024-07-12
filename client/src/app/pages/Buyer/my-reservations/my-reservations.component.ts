import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { JwtDecodeService } from 'src/app/services/jwt-decode.service';
import { UserService } from 'src/app/services/user.service';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService  } from 'ngx-spinner';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, NgxSpinnerModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css'],
  providers: [UserService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MyReservationsComponent {
  currentLoggedInUserId: string = "";
  allUserReservations: Array<any> = [];
  
  
  constructor(
    private userService: UserService,
    private jwtDecodeService: JwtDecodeService,
    private loadingSpinner: NgxSpinnerService
  ) {
    this.currentLoggedInUserId = this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'))?.id;
    this.getUserReservations(this.currentLoggedInUserId);
  }

  ngAfterViewInit(): void { this.loadingSpinner.show(); }

  getUserReservations(movieId: string) {
    this.userService.getUserReservations(movieId)
    .subscribe({
      next: (res) => {
        this.allUserReservations = res.data;
        this.loadingSpinner.hide();
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
}
