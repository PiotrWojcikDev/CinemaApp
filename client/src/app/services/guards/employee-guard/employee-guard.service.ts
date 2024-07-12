import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtDecodeService } from '../../jwt-decode.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuardService {

  constructor(
    private jwtDecodeService: JwtDecodeService,
    private router: Router,
    private toast: NgToastService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'))?.role === "Employee") {
      return true;
    }
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
    this.toast.error({detail: "ERROR", summary: "Nie masz wystarczających uprawnień do tego zasobu!", duration: 5000, position: 'topCenter'});

    return false;
  }
}
