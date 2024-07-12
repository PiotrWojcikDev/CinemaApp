import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  loginService(loginObj: any) {
    return this.http.post<any>(`${ApiPaths.Auth}/login`, loginObj, 
    {withCredentials: true, observe: 'response'});
  }
  
  registerService(registerObj: any) {
    return this.http.post<any>(`${ApiPaths.Auth}/register`, registerObj);
  }

  sendEmail(email: any) {
    return this.http.post<any>(`${ApiPaths.Auth}/forgotPassword`, {email: email});
  }

  resetPassword(resetObj: any) {
    return this.http.post<any>(`${ApiPaths.Auth}/resetPassword`, resetObj);
  }
}
