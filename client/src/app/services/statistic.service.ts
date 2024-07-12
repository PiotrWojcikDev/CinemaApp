import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  jwtToken = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': `${this.jwtToken}`
  });

  constructor(
    private http: HttpClient
  ) { }

  getMonthlyReserervationsSummary() {
    return this.http.get<any>(`${ApiPaths.Statistics}/monthlyReservationsSummary`, { headers: this.headers});
  }

  getMostViewedGenres() {
    return this.http.get<any>(`${ApiPaths.Statistics}/mostViewedGenres`, { headers: this.headers});
  }
  
  getMostViewedMovies() {
    return this.http.get<any>(`${ApiPaths.Statistics}/mostViewedMovies`, { headers: this.headers});
  }
}
