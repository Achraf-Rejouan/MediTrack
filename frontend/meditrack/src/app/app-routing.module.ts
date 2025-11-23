import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BookAppointmentComponent } from './appointment/book-appointment/book-appointment.component';
import { DoctorDashboardComponent } from './appointment/doctor-dashboard/doctor-dashboard.component';
import { MyAppointmentsComponent } from './appointment/my-appointments/my-appointments.component';
import { AdminDashboardComponent } from './appointment/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'book-appointment',
    component: BookAppointmentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['PATIENT'] }
  },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['DOCTOR'] }
  },
  {
    path: 'my-appointments',
    component: MyAppointmentsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['PATIENT'] }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
