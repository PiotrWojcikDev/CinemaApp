import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-basic-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './basic-navbar.component.html',
  styleUrls: ['./basic-navbar.component.css']
})
export class BasicNavbarComponent {

}
