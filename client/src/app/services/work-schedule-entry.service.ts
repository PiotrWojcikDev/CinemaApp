import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class WorkScheduleEntryService {
  jwtToken = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': `${this.jwtToken}`
  });

  constructor(
    private http: HttpClient
  ) { }

  getAllWorkScheduleEntries() {
    return this.http.get<any>(`${ApiPaths.WorkScheduleEntries}/getAll`, { headers: this.headers});
  }

  updateWorkScheduleEntry(workScheduleEntryObj: any) {
    return this.http.put<any>(`${ApiPaths.WorkScheduleEntries}/${workScheduleEntryObj._id}`, workScheduleEntryObj, { headers: this.headers});
  }
}
