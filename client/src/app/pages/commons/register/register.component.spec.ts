import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from "@angular/router/testing";

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, HttpClientModule, 
        RegisterComponent, RouterTestingModule
      ],
      declarations: [], 
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a password control with required validator', () => {
    const passwordControl = component.registrationForm.get('password');
    expect(passwordControl).toBeTruthy();

    passwordControl?.setValue(''); 
    expect(passwordControl?.hasError('required')).toBeTruthy();

    passwordControl?.setValue('ValidPassword123!'); 
    expect(passwordControl?.valid).toBeTruthy();
  });
  it('should have a password control with pattern validator', () => {
      const passwordControl = component.registrationForm.get('password');
      expect(passwordControl).toBeTruthy();

      passwordControl?.setValue('invalidpassword'); 
      expect(passwordControl?.hasError('pattern')).toBeTruthy();

      passwordControl?.setValue('ValidPassword123!'); 
      expect(passwordControl?.valid).toBeTruthy();
  });

  it('should have a confirmPassword control with required validator', () => {
    const confirmPasswordControl = component.registrationForm.get('confirmPassword');
    expect(confirmPasswordControl).toBeTruthy();

    confirmPasswordControl?.setValue(''); 
    expect(confirmPasswordControl?.hasError('required')).toBeTruthy();
  });

  it('should validate passwords match', () => {
    const passwordControl = component.registrationForm.get('password');
    const confirmPasswordControl = component.registrationForm.get('confirmPassword');

    passwordControl?.setValue('ValidPassword123!');
    confirmPasswordControl?.setValue('ValidPassword123!');
    expect(confirmPasswordControl?.valid).toBeTruthy();

    confirmPasswordControl?.setValue('invalidpassword');
    expect(component.registrationForm.hasError('passwordsNotMatch')).toBeTruthy();
  });
});
