import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder,  Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../components/navbars/navbar/navbar.component';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../../../services/auth.service';
import { passwordsMatchValidator } from '../../../validators/passwords-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css',
    '../../../../styles.css'
  ],
  providers: [
    AuthService,
  ]
})
export class RegisterComponent implements OnInit {

  isMailUnique: boolean = true;
  registrationForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: NgToastService,
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern('[- +()0-9]{9,12}')
      ]],
      password: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()+=<>?])[A-Za-z\d~!@#$%^&*()+=<>?]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
    },
    { 
      validator: passwordsMatchValidator 
    }
    );
  }
  
  register() {
    this.authService.registerService(this.registrationForm.value)
    .subscribe({
      next: (res) => {
        this.registrationForm.reset();
        setTimeout(()=> {
          this.router.navigate(['login']);
        }, 1000);
        
      },
      error: (err) => {
        this.toast.error({
          detail:"ERROR", 
          summary: err.error.message, 
          duration: 5000, 
          position: 'topCenter'
        });
      }
    });
  }
}
