import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-delete-confirmation-modal.component.html',
  styleUrls: [
    './employee-delete-confirmation-modal.component.css',
    '../../../../styles.css'
  ]
})
export class EmployeeDeleteConfirmationModalComponent {
  @Input() employeeObj: any;


  constructor(
    public employeeService: EmployeeService,
    private router: Router
  ) { }

  deleteEmployee() {
    console.log("Deleting " + this.employeeObj._id)
    this.employeeService.deleteEmployee(this.employeeObj._id)
    .subscribe({
      next: (res) => {
        console.log("ok")
        this.refreshComponent();
      },
      error: (err) => {
        console.log(err);
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
