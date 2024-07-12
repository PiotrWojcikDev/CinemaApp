import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {  
  showReservationDeleteConfirmationModal = false;

  jwtToken = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': `${this.jwtToken}`
  });
  
  constructor(
    private http: HttpClient
  ) { }

  getAllReservations() {
    return this.http.get<any>(`${ApiPaths.Reservations}/getAll`, { headers: this.headers});
  }

  addReservation(reservationObj: any) {
    return this.http.post<any>(`${ApiPaths.Reservations}`, reservationObj, { headers: this.headers});
  }

  deleteReservation(reservationObj: any) {
    const options = {
      body: reservationObj,
      headers: this.headers
    };
    return this.http.delete<any>(`${ApiPaths.Reservations}/${reservationObj._id}`, options);
  }
}
