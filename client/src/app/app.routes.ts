import { Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/Owner/employee-list/employee-list.component';
import { EmployeeWorkScheduleComponent } from './pages/Employee/employee-work-schedule/employee-work-schedule.component';
import { ForgotPasswordComponent } from './pages/commons/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/commons/login/login.component';
import { MoviesComponent } from './pages/commons/movies/movies.component';
import { MovieSeancesComponent } from './pages/Buyer/movie-seances/movie-seances.component';
import { MyReservationsComponent } from './pages/Buyer/my-reservations/my-reservations.component';
import { PageNotFoundComponent } from './pages/commons/page-not-found/page-not-found.component';
import { RegisterComponent } from './pages/commons/register/register.component';
import { ReservationsComponent } from './pages/Employee/reservations/reservations.component';
import { ReservationSummaryComponent } from './pages/Buyer/reservation-summary/reservation-summary.component';
import { ResetPasswordComponent } from './pages/commons/reset-password/reset-password.component';
import { SeancesComponent } from './pages/commons/seances/seances.component';
import { SeatsComponent } from './pages/Buyer/seats/seats.component';
import { StatisticsComponent } from './pages/Owner/statistics/statistics.component';
import { WorkScheduleComponent } from './pages/Owner/work-schedule/work-schedule.component';

import { BuyerGuardService } from './services/guards/buyer-guard/buyer-guard.service';
import { EmployeeGuardService } from './services/guards/employee-guard/employee-guard.service';
import { OwnerGuardService } from './services/guards/owner-guard/owner-guard.service';
import { OwnerOrEmployeeGuardService } from './services/guards/owner-or-employee-guard/owner-or-employee-guard.service';

export const routes: Routes = [
    { path: '', component: MoviesComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgotPassword', component: ForgotPasswordComponent },
    { path: 'resetPassword/:token', component: ResetPasswordComponent },
    { path: 'movies', component: MoviesComponent },
    { path: 'movies/:id/seances', component: MovieSeancesComponent },
    { path: 'myReservations',       
        component: MyReservationsComponent, 
        canActivate: [BuyerGuardService] 
    },
    { 
        path: 'seances/:id/seats',    
        component: SeatsComponent, 
        canActivate: [BuyerGuardService] 
    },
    {
        path: 'reservationSummary',   
        component: ReservationSummaryComponent, 
        canActivate: [BuyerGuardService] 
    },
    { 
        path: 'employeeSchedule',     
        component: EmployeeWorkScheduleComponent, 
        canActivate: [EmployeeGuardService] 
    },
    { 
        path: 'reservations',         
        component: ReservationsComponent, 
        canActivate: [EmployeeGuardService] 
    },
    { 
        path: 'employees',            
        component: EmployeeListComponent, 
        canActivate: [OwnerGuardService] 
    },
    { 
        path: 'schedule',             
        component: WorkScheduleComponent, 
        canActivate: [OwnerGuardService] 
    },
    { 
        path: 'statistics',           
        component: StatisticsComponent, 
        canActivate: [OwnerGuardService] 
    },
    {
        path: 'seances',              
        component: SeancesComponent, 
        canActivate: [OwnerOrEmployeeGuardService] 
    },
    
    {  path: '**', component: PageNotFoundComponent }
];
