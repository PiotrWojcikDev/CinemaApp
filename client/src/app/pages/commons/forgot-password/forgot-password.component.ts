import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbars/navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { JwtDecodeService } from 'src/app/services/jwt-decode.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css','../../../../styles.css'
  ],
  providers: [AuthService]
})
export class ForgotPasswordComponent {
  forgotForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private jwtDecodeService: JwtDecodeService,
    private router: Router,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  
  sendEmail() {
    this.authService.sendEmail(this.forgotForm.value.email)
    .subscribe({
      next: (res) => {
        this.toast.success({detail:"Success", summary: res.message, duration: 5000, position: 'topCenter'});
        this.forgotForm.reset();
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
    }});
  }
}
