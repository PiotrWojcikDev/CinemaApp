import { environment } from './environments/environment';

export class ApiPaths {
     static Auth = `${environment.apiUrl}/auth`;
     static Movies = `${environment.apiUrl}/movies`;
     static Employees = `${environment.apiUrl}/employees`;
     static WorkScheduleEntries = `${environment.apiUrl}/scheduleEntries`;
     static Reservations = `${environment.apiUrl}/reservations`;
     static Seances = `${environment.apiUrl}/seances`;
     static Users = `${environment.apiUrl}/users`;
     static Statistics = `${environment.apiUrl}/statistics`;
}
 