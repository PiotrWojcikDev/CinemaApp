import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-navbar.component.html',
  styleUrls: ['./employee-navbar.component.css']
})
export class EmployeeNavbarComponent {
  
  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['login']);
  }
}
