import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  showAddSeanceDialog = false;
  showUpdateSeancePriceDialog = false;
  showDeleteSeancePriceDialog = false;

  jwtToken = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': `${this.jwtToken}`
  });

  constructor(
    private http: HttpClient
  ) { }

  addSeance(seanceObj: any) {
    return this.http.post<any>(`${ApiPaths.Seances}`, seanceObj);
  }

  getAllSeances() {
    return this.http.get<any>(`${ApiPaths.Seances}/getAll`);
  }

  getSeanceById(seanceId: string) {
    return this.http.get<any>(`${ApiPaths.Seances}/${seanceId}`);
  }

  getReservedSeatsForSeance(seanceId: string) {
    return this.http.get<any>(`${ApiPaths.Seances}/${seanceId}/seats`);
  }

  updateSeancePrice(seanceObj: any) {
    return this.http.put<any>(`${ApiPaths.Seances}/${seanceObj._id}`, seanceObj);
  }
}
