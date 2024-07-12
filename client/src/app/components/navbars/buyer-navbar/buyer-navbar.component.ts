import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-buyer-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buyer-navbar.component.html',
  styleUrls: ['./buyer-navbar.component.css']
})
export class BuyerNavbarComponent {

  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['login']);
  }
}
