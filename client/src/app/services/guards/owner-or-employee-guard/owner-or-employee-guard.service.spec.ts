import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OwnerOrEmployeeGuardService } from './owner-or-employee-guard.service';
import { JwtDecodeService } from '../../jwt-decode.service';
import { NgToastService } from 'ng-angular-popup';

describe('OwnerOrEmployeeGuardService', () => {
  let service: OwnerOrEmployeeGuardService;
  let jwtDecodeService: JwtDecodeService;
  let router: any; // Mock Router
  let toast: any; // Mock NgToastService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        OwnerOrEmployeeGuardService,
        JwtDecodeService,
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: NgToastService, useValue: { error: jest.fn() } },
      ],
    }).compileComponents();

    service = TestBed.inject(OwnerOrEmployeeGuardService);
    jwtDecodeService = TestBed.inject(JwtDecodeService);
    router = TestBed.inject(Router) as any;
    toast = TestBed.inject(NgToastService) as any;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow access for a Employee or Owner', () => {
    const decodedToken = { role: 'Owner' };
    jest.spyOn(jwtDecodeService, 'decodeToken').mockImplementation(() => decodedToken);
    const canActivate = service.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    console.log(decodedToken);
    expect(canActivate).toBeTruthy();
  });

  it('should navigate to login page and show an error toast for non-Employees or non-Owners', () => {
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

  it('should remove access_token from localStorage for non-Employees or non-Owners', () => {
    jest.spyOn(jwtDecodeService, 'decodeToken').mockReturnValue({ role: 'SomeOtherRole' });
    service.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(localStorage.getItem('access_token')).toBeFalsy();
  });
});
