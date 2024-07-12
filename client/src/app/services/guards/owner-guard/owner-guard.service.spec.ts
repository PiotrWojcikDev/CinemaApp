import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OwnerGuardService } from './owner-guard.service';
import { JwtDecodeService } from '../../jwt-decode.service';
import { NgToastService } from 'ng-angular-popup';

describe('OwnerGuardService', () => {
  let service: OwnerGuardService;
  let jwtDecodeService: JwtDecodeService;
  let router: any; 
  let toast: any; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        OwnerGuardService,
        JwtDecodeService,
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: NgToastService, useValue: { error: jest.fn() } },
      ],
    }).compileComponents();

    service = TestBed.inject(OwnerGuardService);
    jwtDecodeService = TestBed.inject(JwtDecodeService);
    router = TestBed.inject(Router) as any;
    toast = TestBed.inject(NgToastService) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow access for a Owner', () => {
    jest.spyOn(jwtDecodeService, 'decodeToken')
        .mockReturnValue({ role: 'Owner' });
    const canActivate = service.canActivate(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot
    );
    expect(canActivate).toBeTruthy();
  });

  it('should navigate to login page and show a toast for non-Owners', () => {
    jest.spyOn(jwtDecodeService, 'decodeToken')
        .mockReturnValue({ role: 'SomeOtherRole' });
    const canActivate = service.canActivate(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot
    );
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toast.error).toHaveBeenCalledWith({
      detail: 'ERROR',
      summary: 'Nie masz wystarczających uprawnień do tego zasobu!',
      duration: 5000,
      position: 'topCenter',
    });
  });

  it('should remove access_token from localStorage for non-Owners', () => {
    jest.spyOn(jwtDecodeService, 'decodeToken')
        .mockReturnValue({ role: 'SomeOtherRole' });
    service.canActivate(
      {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot
    );
    expect(localStorage.getItem('access_token')).toBeFalsy();
  });
});
