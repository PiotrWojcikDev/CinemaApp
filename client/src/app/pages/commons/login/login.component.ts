import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { JwtDecodeService } from 'src/app/services/jwt-decode.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../../styles.css'
  ],
  providers: [
    AuthService,
    JwtDecodeService
  ]
})
export class LoginComponent implements OnInit{
  
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private jwtDecodeService: JwtDecodeService,
    private router: Router,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    this.authService.loginService(this.loginForm.value)
    .subscribe({
      next: (res) => {
        const token: string = res.headers.get('Authorization') || '';
        localStorage.setItem('access_token', token);
        const userRole = this.jwtDecodeService
          .decodeToken(localStorage.getItem('access_token'));

        if(userRole.role === "Owner") {
          console.log("Owner")
          this.router.navigate(['employees']);
        } else {
          this.router.navigate(['movies']);
        } 
      },
      error: (err) => {
        this.toast.error({
          detail:"ERROR", 
          summary: err.error.message, 
          duration: 5000, 
          position: 'topCenter'});
    }});
  }

}
