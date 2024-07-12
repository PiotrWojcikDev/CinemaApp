import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtDecodeService } from '../../jwt-decode.service';
import { Observable } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class OwnerOrEmployeeGuardService {
  

  constructor(
    private jwtDecodeService: JwtDecodeService,
    private router: Router,
    private toast: NgToastService,
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const decodedToken = this.jwtDecodeService.decodeToken(localStorage.getItem('access_token'));

    if(decodedToken?.role === "Owner" || decodedToken?.role === "Employee") {
      return true;
    }
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
    this.toast.error({detail: "ERROR", summary: "Nie masz wystarczających uprawnień do tego zasobu!", duration: 5000, position: 'topCenter'});
    return false;
  }
}
