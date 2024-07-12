import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  jwtToken = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': `${this.jwtToken}`
  });
  
  constructor(
    private http: HttpClient
  ) { }
  
  getUserById(userId: string) {
    return this.http.get<any>(`${ApiPaths.Users}/${userId}`, { headers: this.headers});
  }

  getUserReservations(userId: string) {
    return this.http.get<any>(`${ApiPaths.Users}/${userId}/reservations`, { headers: this.headers});
  }
}
