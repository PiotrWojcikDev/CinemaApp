import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyerNavbarComponent } from '../buyer-navbar/buyer-navbar.component';
import { EmployeeNavbarComponent } from '../employee-navbar/employee-navbar.component';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { JwtDecodeService } from '../../../services/jwt-decode.service';
import { BasicNavbarComponent } from '../basic-navbar/basic-navbar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, BasicNavbarComponent, BuyerNavbarComponent, EmployeeNavbarComponent, OwnerNavbarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentLoggedInUserType: string = "";
  
  constructor(private jwtDecodeService: JwtDecodeService) {
    this.currentLoggedInUserType = this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'))?.role;
  }
}
