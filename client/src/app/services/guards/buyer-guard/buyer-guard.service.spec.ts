import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BuyerGuardService } from './buyer-guard.service';
import { JwtDecodeService } from '../../jwt-decode.service';
import { NgToastService } from 'ng-angular-popup';
import { inject } from '@angular/core';

describe('BuyerGuardService', () => {
  let service: BuyerGuardService;
  let jwtDecodeService: JwtDecodeService;
  let router: any; // Mock Router
  let toast: any; // Mock NgToastService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        BuyerGuardService,
        JwtDecodeService,
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: NgToastService, useValue: { error: jest.fn() } },
      ],
    }).compileComponents();

    service = TestBed.inject(BuyerGuardService);
    jwtDecodeService = TestBed.inject(JwtDecodeService);
    router = TestBed.inject(Router) as any;
    toast = TestBed.inject(NgToastService) as any;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow access for a Buyer', () => {
    jest.spyOn(jwtDecodeService, 'decodeToken').mockReturnValue({ role: 'Buyer' });
    const canActivate = service.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(canActivate).toBeTruthy();
  });

  it('should navigate to login page and show an error toast for non-Buyers', () => {
    jest.spyOn(jwtDecodeService, 'decodeToken').mockReturnValue({ role: 'SomeOtherRole' });
    const canActivate = service.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toast.error).toHaveBeenCalledWith({
      detail: 'ERROR',
      summary: 'Nie masz wystarczających uprawnień do tego zasobu!',
      duration: 5000,
      position: 'topCenter',
    });
  });

  it('should remove access_token from localStorage for non-Buyers', () => {
    jest.spyOn(jwtDecodeService, 'decodeToken').mockReturnValue({ role: 'SomeOtherRole' });
    service.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(localStorage.getItem('access_token')).toBeFalsy();
  });
});
