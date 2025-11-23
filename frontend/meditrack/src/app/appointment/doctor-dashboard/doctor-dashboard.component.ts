import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentResponse } from '../../models/appointment.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `
    <div class="doctor-dashboard">
      <h1>Doctor Dashboard</h1>

      <div class="tabs">
        <button
          class="tab-button"
          [class.active]="activeTab === 'pending'"
          (click)="activeTab = 'pending'">
          Pending Requests ({{ pendingAppointments.length }})
        </button>
        <button
          class="tab-button"
          [class.active]="activeTab === 'approved'"
          (click)="activeTab = 'approved'">
          My Schedule ({{ approvedAppointments.length }})
        </button>
      </div>

      <div class="tab-content">
        <!-- Pending Appointments Tab -->
        <div *ngIf="activeTab === 'pending'" class="pending-section">
          <h2>Pending Appointment Requests</h2>
          <div *ngIf="pendingAppointments.length === 0" class="no-data">
            No pending appointment requests
          </div>
          <div class="appointments-list">
            <div *ngFor="let apt of pendingAppointments" class="appointment-card">
              <div class="patient-info">
                <h3>{{ apt.patient.username }}</h3>
                <p>{{ apt.appointmentDateTime | date: 'medium' }}</p>
              </div>
              <p class="reason">{{ apt.reason }}</p>
              <div class="actions">
                <button
                  class="btn-approve"
                  [disabled]="processingId === apt.id"
                  (click)="approveAppointment(apt)">
                  {{ processingId === apt.id ? 'Processing...' : 'Approve' }}
                </button>
                <button
                  class="btn-reject"
                  [disabled]="processingId === apt.id"
                  (click)="rejectAppointment(apt)">
                  {{ processingId === apt.id ? 'Processing...' : 'Reject' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Approved Schedule Tab -->
        <div *ngIf="activeTab === 'approved'" class="approved-section">
          <h2>My Approved Schedule</h2>
          <div *ngIf="approvedAppointments.length === 0" class="no-data">
            No approved appointments
          </div>
          <div class="appointments-list">
            <div *ngFor="let apt of approvedAppointments" class="appointment-card">
              <div class="patient-info">
                <h3>{{ apt.patient.username }}</h3>
                <p>{{ apt.appointmentDateTime | date: 'medium' }}</p>
              </div>
              <p class="reason">{{ apt.reason }}</p>
              <span class="status-badge approved">APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doctor-dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 70px);
    }

    h1 {
      color: var(--text-color);
      margin-bottom: 32px;
      font-size: 32px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      
      &::before {
        content: '';
        width: 4px;
        height: 32px;
        background: var(--color-primary);
        border-radius: 2px;
      }
    }

    .tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0;
    }

    .tab-button {
      padding: 12px 24px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 16px;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
      position: relative;
      text-transform: none;
    }

    .tab-button.active {
      color: var(--color-primary);
      border-bottom-color: var(--color-primary);
      font-weight: 600;
    }

    .tab-button:hover:not(.active) {
      color: var(--text-color);
      background: var(--bg-color);
    }

    .tab-content {
      margin-top: 24px;
    }

    h2 {
      color: var(--text-color);
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 600;
    }

    .no-data {
      text-align: center;
      color: var(--text-secondary);
      padding: 60px 40px;
      background: var(--surface-color);
      border-radius: 16px;
      font-size: 16px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .appointments-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .appointment-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
    }

    .appointment-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .patient-info h3 {
      margin: 0 0 8px 0;
      color: var(--text-color);
      font-size: 18px;
      font-weight: 600;
    }

    .patient-info p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .reason {
      color: var(--text-color);
      font-size: 14px;
      margin: 16px 0;
      padding: 12px;
      background: var(--bg-color);
      border-radius: 8px;
      border-left: 3px solid var(--color-primary);
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .btn-approve,
    .btn-reject {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
      text-transform: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .btn-approve {
      background: var(--color-success);
      color: white;
    }

    .btn-approve:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-approve:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-reject {
      background: var(--color-error);
      color: white;
    }

    .btn-reject:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-reject:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.approved {
      background: rgba(6, 214, 160, 0.2);
      color: var(--color-success);
      border: 1px solid var(--color-success);
    }

    @media (max-width: 768px) {
      .doctor-dashboard {
        padding: 16px;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 24px;
      }

      .tabs {
        gap: 8px;
        margin-bottom: 24px;
      }

      .tab-button {
        padding: 10px 16px;
        font-size: 14px;
      }

      .appointments-list {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .appointment-card {
        padding: 20px;
      }
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  activeTab: 'pending' | 'approved' = 'pending';
  pendingAppointments: AppointmentResponse[] = [];
  approvedAppointments: AppointmentResponse[] = [];
  loading = false;
  processingId: number | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    console.log('Loading appointments...');
    this.loading = true;
    this.appointmentService.getPendingAppointments().subscribe({
      next: (data) => {
        console.log('Pending appointments loaded:', data);
        this.pendingAppointments = data;
      },
      error: (err) => {
        console.error('Error loading pending appointments:', err);
        this.snackBar.open('Failed to load pending appointments', 'Close', { duration: 5000 });
      },
      complete: () => {
        this.appointmentService.getApprovedAppointments().subscribe({
          next: (data) => {
            console.log('Approved appointments loaded:', data);
            this.approvedAppointments = data;
          },
          error: (err) => {
            console.error('Error loading approved appointments:', err);
            this.snackBar.open('Failed to load approved appointments', 'Close', { duration: 5000 });
          },
          complete: () => this.loading = false
        });
      }
    });
  }

  approveAppointment(apt: AppointmentResponse): void {
    console.log('🟢 Approve button clicked, appointmentId:', apt.id, 'version:', apt.version);

    if (!apt || !apt.id) {
      console.error('❌ Invalid appointment data:', apt);
      this.snackBar.open('Error: Invalid appointment data', 'Close', { duration: 5000 });
      return;
    }

    if (!apt.version && apt.version !== 0) {
      console.error('❌ Error: Invalid appointment data - no version:', apt);
      this.snackBar.open('Error: Invalid appointment data', 'Close', { duration: 5000 });
      return;
    }

    this.processingId = apt.id;
    console.log('🟢 Calling service to approve appointment:', apt.id, 'with status: APPROVED, version:', apt.version);

    const request = {
      status: 'APPROVED',
      version: apt.version
    };
    console.log('🟢 Request payload:', request);

    const subscription = this.appointmentService.updateAppointmentStatus(apt.id, request).subscribe({
      next: (response) => {
        console.log('✅ API Success - Appointment approved:', response);
        this.snackBar.open('Appointment approved successfully', 'Close', { duration: 5000 });
        this.processingId = null;
        this.loadAppointments();
      },
      error: (err) => {
        console.error('❌ API Error - Failed to approve appointment:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.processingId = null;
        const errorMsg = err.error?.message || err.message || 'Failed to approve appointment';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      },
      complete: () => {
        console.log('🟢 Approve appointment observable completed');
      }
    });

    // Verify subscription was created
    if (!subscription || subscription.closed) {
      console.error('❌ Subscription was not created or is already closed!');
      this.snackBar.open('Error: Failed to initiate approval request', 'Close', { duration: 5000 });
      this.processingId = null;
    }
  }

  rejectAppointment(apt: AppointmentResponse): void {
    console.log('🔴 Reject button clicked, appointmentId:', apt.id, 'version:', apt.version);

    if (!apt || !apt.id) {
      console.error('❌ Invalid appointment data:', apt);
      this.snackBar.open('Error: Invalid appointment data', 'Close', { duration: 5000 });
      return;
    }

    if (!apt.version && apt.version !== 0) {
      console.error('❌ Error: Invalid appointment data - no version:', apt);
      this.snackBar.open('Error: Invalid appointment data', 'Close', { duration: 5000 });
      return;
    }

    this.processingId = apt.id;
    console.log('🔴 Calling service to reject appointment:', apt.id, 'with status: REJECTED, version:', apt.version);

    const request = {
      status: 'REJECTED',
      version: apt.version
    };
    console.log('🔴 Request payload:', request);

    const subscription = this.appointmentService.updateAppointmentStatus(apt.id, request).subscribe({
      next: (response) => {
        console.log('✅ API Success - Appointment rejected:', response);
        this.snackBar.open('Appointment rejected successfully', 'Close', { duration: 5000 });
        this.processingId = null;
        this.loadAppointments();
      },
      error: (err) => {
        console.error('❌ API Error - Failed to reject appointment:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.processingId = null;
        const errorMsg = err.error?.message || err.message || 'Failed to reject appointment';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      },
      complete: () => {
        console.log('🔴 Reject appointment observable completed');
      }
    });

    // Verify subscription was created
    if (!subscription || subscription.closed) {
      console.error('❌ Subscription was not created or is already closed!');
      this.snackBar.open('Error: Failed to initiate rejection request', 'Close', { duration: 5000 });
      this.processingId = null;
    }
  }
}

