import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddEmployeeDialogComponent } from './add-employee-dialog.component';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

describe('AddEmployeeDialogComponent', () => {
  let component: AddEmployeeDialogComponent;
  let fixture: ComponentFixture<AddEmployeeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, AddEmployeeDialogComponent],
      providers: [
        { provide: NgToastService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: EmployeeService, useValue: {} }, 
      ],
    });

    fixture = TestBed.createComponent(AddEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate phone number field', () => {
    const phoneNumberControl = 
        component.addEmployeeForm.get('phoneNumber');

    phoneNumberControl?.setValue('123456789');
    expect(phoneNumberControl?.valid).toBeTruthy();

    phoneNumberControl?.setValue('invalidPhoneNumber');
    expect(phoneNumberControl?.valid).toBeFalsy();

    phoneNumberControl?.markAsTouched();
    fixture.detectChanges();
    const errorMessage = 
        fixture.nativeElement.querySelector('.text-danger');
    expect(errorMessage.textContent)
    .toContain('Numer telefonu jest niepoprawny');
  });
});
