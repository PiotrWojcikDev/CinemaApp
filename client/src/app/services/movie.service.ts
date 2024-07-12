import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  showAddMovieDialog = false;
  jwtToken = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': `${this.jwtToken}`
  });

  constructor(
    private http: HttpClient
  ) { }  

  getAllMovies() {
    return this.http.get<any>(`${ApiPaths.Movies}/getAll`);
  }

  getMovieById(movieId: any) {
    return this.http.get<any>(`${ApiPaths.Movies}/${movieId}`);
  }

  getMovieSeances(movieId: string) {
    return this.http.get<any>(`${ApiPaths.Movies}/${movieId}/seances`);
  }

  addMovie(movieObj: any) {
    return this.http.post<any>(`${ApiPaths.Movies}`, movieObj, { headers: this.headers });
  }
}
