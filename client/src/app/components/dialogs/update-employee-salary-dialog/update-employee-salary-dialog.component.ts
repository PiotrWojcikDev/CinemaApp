import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-update-employee-salary-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './update-employee-salary-dialog.component.html',
  styleUrls: ['./update-employee-salary-dialog.component.css','../../../../styles.css'
  ]
})
export class UpdateEmployeeSalaryDialogComponent {
  @Input() employeeObj: any;

  addEmployeeForm!:FormGroup;

  constructor(
    public employeeService: EmployeeService, 
    private formBuilder: FormBuilder, 
    private toast: NgToastService, 
  ) { }


  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      salary: ['', Validators.required]
    })
  }

  changeSalary() {
    this.employeeService.showUpdateEmployeeSalaryDialog = false;   
    this.employeeObj.salary = this.addEmployeeForm.value.salary; 
    console.log(this.employeeObj);
    this.employeeService.updateEmployeeSalary(this.employeeObj)
    .subscribe({
      next: (res) => {
        console.log("ok")
      },
      error: (err) => {
        this.toast.error({detail:"ERROR", summary: err.error.message, duration: 5000, position: 'topCenter'});
      }
    });
  }
}