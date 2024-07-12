import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { BasicNavbarComponent } from '../basic-navbar/basic-navbar.component';
import { BuyerNavbarComponent } from '../buyer-navbar/buyer-navbar.component';
import { EmployeeNavbarComponent } from '../employee-navbar/employee-navbar.component';
import { OwnerNavbarComponent } from '../owner-navbar/owner-navbar.component';
import { JwtDecodeService } from '../../../services/jwt-decode.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from "@angular/router/testing";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [JwtDecodeService],
      imports: [CommonModule, NavbarComponent, BasicNavbarComponent, BuyerNavbarComponent, EmployeeNavbarComponent, OwnerNavbarComponent, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render BasicNavbarComponent when currentLoggedInUserType is undefined', () => {
    component.currentLoggedInUserType = "";
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-basic-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-buyer-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-employee-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-owner-navbar')).toBeFalsy();
  });

  it('should render BuyerNavbarComponent when currentLoggedInUserType is "Buyer"', () => {
    component.currentLoggedInUserType = 'Buyer';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-basic-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-buyer-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-employee-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-owner-navbar')).toBeFalsy();
  });

  it('should render EmployeeNavbarComponent when currentLoggedInUserType is "Employee"', () => {
    component.currentLoggedInUserType = 'Employee';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-basic-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-buyer-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-employee-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-owner-navbar')).toBeFalsy();
  });

  it('should render OwnerNavbarComponent when currentLoggedInUserType is "Owner"', () => {
    component.currentLoggedInUserType = 'Owner';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-basic-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-buyer-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-employee-navbar')).toBeFalsy();
    expect(compiled.querySelector('app-owner-navbar')).toBeTruthy();
  });
});
