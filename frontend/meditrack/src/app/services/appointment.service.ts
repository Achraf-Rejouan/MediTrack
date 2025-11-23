import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, Doctor, AppointmentResponse } from '../models/appointment.model';
import { environment } from '../../environments/environment';

interface StatisticsResponse {
  totalUsers: number;
  totalAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  cancelledAppointments: number;
  totalDoctors: number;
  totalPatients: number;
}

interface UpdateAppointmentStatusRequest {
  status: string;
  version: number;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment);
  }

  // Sprint 3: Doctor endpoints
  getPendingAppointments(): Observable<AppointmentResponse[]> {
    console.log('Service: Fetching pending appointments from', `${this.apiUrl}/appointments/doctor/pending`);
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments/doctor/pending`);
  }

  getApprovedAppointments(): Observable<AppointmentResponse[]> {
    console.log('Service: Fetching approved appointments from', `${this.apiUrl}/appointments/doctor/approved`);
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments/doctor/approved`);
  }

  updateAppointmentStatus(id: number, request: UpdateAppointmentStatusRequest): Observable<AppointmentResponse> {
    const url = `${this.apiUrl}/appointments/${id}/status`;
    console.log('🔵 Service: Updating appointment status');
    console.log('🔵 URL:', url);
    console.log('🔵 Request payload:', request);
    console.log('🔵 Appointment ID:', id);
    const observable = this.http.put<AppointmentResponse>(url, request);
    console.log('🔵 Observable created:', observable);
    return observable;
  }

  // Sprint 3: Patient endpoints
  getMyAppointments(): Observable<AppointmentResponse[]> {
    console.log('Service: Fetching my appointments from', `${this.apiUrl}/appointments/my-appointments`);
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/appointments/my-appointments`);
  }

  // Sprint 4: Cancel appointment
  cancelAppointment(id: number, version: number): Observable<AppointmentResponse> {
    const url = `${this.apiUrl}/appointments/${id}?version=${version}`;
    console.log('🔵 Service: Calling cancel appointment API');
    console.log('🔵 URL:', url);
    console.log('🔵 Appointment ID:', id);
    console.log('🔵 Version:', version);
    const observable = this.http.delete<AppointmentResponse>(url);
    console.log('🔵 Observable created:', observable);
    return observable;
  }

  // Sprint 4: Admin statistics
  getStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.apiUrl}/admin/statistics`);
  }

  // Sprint 4: Admin users
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/admin/users`);
  }
}
