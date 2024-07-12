import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiPaths } from '../../api-paths';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  showAddEmployeeDialog = false;
  showUpdateEmployeeSalaryDialog = false;
  showEmployeeDeleteConfirmationModal = false;
  
  jwtToken = localStorage.getItem('access_token');
  headers = new HttpHeaders({
    'Authorization': `${this.jwtToken}`
  });

  constructor(
    private http: HttpClient
  ) { }


  getAllEmployees() {
    return this.http.get<any>(`${ApiPaths.Employees}/getAll`, { headers: this.headers });
  }

  addEmployee(employeeObj: any) {
    return this.http.post<any>(`${ApiPaths.Employees}`, employeeObj, { headers: this.headers });
  }

  updateEmployeeSalary(employeeObj: any) {
    return this.http.put<any>(`${ApiPaths.Employees}/${employeeObj._id}`, employeeObj, { headers: this.headers });
  }

  deleteEmployee(userId: any) {
    return this.http.delete<any>(`${ApiPaths.Employees}/${userId}`, { headers: this.headers });
  }
}
