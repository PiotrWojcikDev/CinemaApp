import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { passwordsMatchValidator } from '../../../validators/passwords-match.validator';
import { NavbarComponent } from '../../../components/navbars/navbar/navbar.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.css',
    '../../../../styles.css'
  ],
  providers: [AuthService]
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  resetPasswordForm!: FormGroup;


  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()+=<>?])[A-Za-z\d~!@#$%^&*()+=<>?]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, 
    { 
      validator: passwordsMatchValidator 
    }); 
  }

  resetPassword() {
    let resetObj = {
      token: this.token,
      password: this.resetPasswordForm.value.password
    }
    this.authService.resetPassword(resetObj)
    .subscribe({
      next: (res) => {
        this.toast.success({detail:"Success", summary: res.message, duration: 5000, position: 'topCenter'});
        this.resetPasswordForm.reset();
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
    }});
  }



}
