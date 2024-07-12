import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from '../../../components/navbars/navbar/navbar.component';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeDialogComponent } from '../../../components/dialogs/add-employee-dialog/add-employee-dialog.component';
import { EmployeeDeleteConfirmationModalComponent } from '../../../components/modals/employee-delete-confirmation-modal/employee-delete-confirmation-modal.component';
import { UpdateEmployeeSalaryDialogComponent } from '../../../components/dialogs/update-employee-salary-dialog/update-employee-salary-dialog.component';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AddEmployeeDialogComponent, UpdateEmployeeSalaryDialogComponent, EmployeeDeleteConfirmationModalComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: [
    './employee-list.component.css',
    '../../../../styles.css'
  ],
  providers: [EmployeeService]
})
export class EmployeeListComponent {
  
  allEmployees: Array<any> = [];
  employeeToUpdate: any;
  employeeToDelete: any;


  constructor(
    public employeeService: EmployeeService,
    private router: Router
  ) {
    this.getAllEmployees();
  } 
  
  getAllEmployees() {
    this.employeeService.getAllEmployees()
    .subscribe({
      next: (res) => {
        this.allEmployees = res.data.filter((employee: { lastName: string; })  => employee.lastName !== 'Pracownik');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  updateEmployeeSalary(employeeObj: any) {
    this.employeeToUpdate = employeeObj;
    this.employeeService.showUpdateEmployeeSalaryDialog = true;
  }

  deleteEmployee(employeeObj: any) {
    console.log("Deleting ")
    this.employeeToDelete = employeeObj;
    this.employeeService.showEmployeeDeleteConfirmationModal = true;
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