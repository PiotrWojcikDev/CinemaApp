import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordsMatchValidator } from '../../../validators/passwords-match.validator';
import { Router, RouterModule } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-employee-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: [
    './add-employee-dialog.component.css',
    '../../../../styles.css'
  ]
})
export class AddEmployeeDialogComponent implements OnInit {
  addEmployeeForm!: FormGroup;

  constructor(
    public employeeService: EmployeeService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private toast: NgToastService, 
  ) { }


  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[- +()0-9]{9,12}')]],
      salary: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()+=<>?])[A-Za-z\d~!@#$%^&*()+=<>?]{8,}$/)]],
      confirmPassword: ['', Validators.required],

    }, 
    { 
      validator: passwordsMatchValidator 
    });
  }

  addEmployee() {
    this.employeeService.showAddEmployeeDialog = false;    
    this.employeeService.addEmployee(this.addEmployeeForm.value)
    .subscribe({
      next: (res) => {
        this.addEmployeeForm.reset();   
        this.refreshComponent(); 
            
      },
      error: (err) => {
        this.toast.error({detail: "ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
      }
    });
  }

  async refreshComponent() {
    const currentUrl = this.router.url;
    try {
      await this.router.navigateByUrl('/', { skipLocationChange: true });
      await this.router.navigate([currentUrl]);
    } catch (error) {
      console.error('Błąd podczas odświeżania komponentu:', error);
    }
  }
}