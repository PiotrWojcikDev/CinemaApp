import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-owner-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-navbar.component.html',
  styleUrls: ['./owner-navbar.component.css']
})
export class OwnerNavbarComponent {

  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['login']);
  }
}
