import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentResponse } from '../../models/appointment.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatDialogModule, MatButtonModule, ConfirmDialogComponent],
  template: `
    <div class="my-appointments">
      <h1>My Appointments</h1>

      <div *ngIf="appointments.length === 0" class="no-data">
        You have no appointments yet.
      </div>

      <div class="appointments-list">
        <div *ngFor="let apt of appointments" class="appointment-card" [ngClass]="'status-' + apt.status.toLowerCase()">
          <div class="card-header">
            <h3>Dr. {{ apt.doctor.lastName }}</h3>
            <span class="status-badge" [ngClass]="'status-' + apt.status.toLowerCase()">
              {{ apt.status }}
            </span>
          </div>

          <div class="card-body">
            <div class="info-row">
              <span class="label">Specialty:</span>
              <span class="value">{{ apt.doctor.specialization }}</span>
            </div>
            <div class="info-row">
              <span class="label">Date & Time:</span>
              <span class="value">{{ formatDate(apt.appointmentDateTime) }}</span>
            </div>
            <div class="info-row" *ngIf="apt.reason">
              <span class="label">Reason:</span>
              <span class="value">{{ apt.reason }}</span>
            </div>
          </div>

          <div class="card-footer">
            <button
              class="btn-cancel"
              *ngIf="apt.status === 'PENDING' || apt.status === 'APPROVED'"
              [disabled]="cancellingId === apt.id"
              (click)="cancelAppointment(apt)">
              {{ cancellingId === apt.id ? 'Cancelling...' : 'Cancel Appointment' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-appointments {
      padding: 24px;
      max-width: 1200px;
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
      gap: 24px;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }

    .appointment-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-left: 5px solid var(--color-primary);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
    }

    .appointment-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }

    .appointment-card.status-pending {
      border-left-color: #ffd166;
    }

    .appointment-card.status-approved {
      border-left-color: var(--color-success);
    }

    .appointment-card.status-rejected {
      border-left-color: var(--color-error);
    }

    .appointment-card.status-cancelled {
      border-left-color: var(--text-secondary);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: var(--bg-color);
      border-bottom: 1px solid var(--border-color);
    }

    .card-header h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 20px;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.status-pending {
      background: rgba(255, 209, 102, 0.2);
      color: #ffd166;
      border: 1px solid #ffd166;
    }

    .status-badge.status-approved {
      background: rgba(6, 214, 160, 0.2);
      color: var(--color-success);
      border: 1px solid var(--color-success);
    }

    .status-badge.status-rejected {
      background: rgba(239, 35, 60, 0.2);
      color: var(--color-error);
      border: 1px solid var(--color-error);
    }

    .status-badge.status-cancelled {
      background: rgba(141, 153, 174, 0.2);
      color: var(--text-secondary);
      border: 1px solid var(--text-secondary);
    }

    .card-body {
      padding: 24px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-color);
    }

    .info-row:last-child {
      margin-bottom: 0;
      border-bottom: none;
      padding-bottom: 0;
    }

    .label {
      color: var(--text-secondary);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .value {
      color: var(--text-color);
      text-align: right;
      font-weight: 500;
    }

    .card-footer {
      padding: 20px 24px;
      border-top: 1px solid var(--border-color);
      background: var(--bg-color);
    }

    .btn-cancel {
      width: 100%;
      padding: 12px 20px;
      background: var(--color-error);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      text-transform: none;
    }

    .btn-cancel:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-cancel:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .my-appointments {
        padding: 16px;
      }

      h1 {
        font-size: 24px;
        margin-bottom: 24px;
      }

      .appointments-list {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .card-header,
      .card-body,
      .card-footer {
        padding: 16px;
      }
    }
  `]
})
export class MyAppointmentsComponent implements OnInit {
  appointments: AppointmentResponse[] = [];
  loading = false;
  cancellingId: number | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        console.log('Appointments loaded:', data);
        this.appointments = data.sort((a, b) => {
          return new Date(b.appointmentDateTime).getTime() -
                 new Date(a.appointmentDateTime).getTime();
        });
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.snackBar.open('Failed to load appointments', 'Close', { duration: 5000 });
      },
      complete: () => this.loading = false
    });
  }

  cancelAppointment(apt: AppointmentResponse): void {
    console.log('🔴 Cancel button clicked, appointmentId:', apt.id, 'version:', apt.version);

    if (!apt || !apt.id) {
      console.error('❌ Invalid appointment data:', apt);
      this.snackBar.open('Error: Invalid appointment data', 'Close', { duration: 5000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to cancel this appointment?' }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log('🔴 Dialog closed, result:', result);

        if (result === true) {
          console.log('🔴 User confirmed, calling API...');

          if (!apt.version && apt.version !== 0) {
            console.error('❌ Error: Invalid appointment data - no version:', apt);
            this.snackBar.open('Error: Invalid appointment data', 'Close', { duration: 5000 });
            return;
          }

          this.cancellingId = apt.id;
          console.log('🔴 Calling cancelAppointment service with id:', apt.id, 'version:', apt.version);
          
          const subscription = this.appointmentService.cancelAppointment(apt.id, apt.version).subscribe({
            next: (response) => {
              console.log('✅ API Success - Appointment cancelled:', response);
              this.snackBar.open('Appointment cancelled successfully', 'Close', { duration: 5000 });
              this.cancellingId = null;
              this.loadAppointments();
            },
            error: (err) => {
              console.error('❌ API Error - Failed to cancel appointment:', err);
              console.error('Error details:', {
                status: err.status,
                statusText: err.statusText,
                message: err.message,
                error: err.error
              });
              this.cancellingId = null;
              const errorMsg = err.error?.message || err.message || 'Failed to cancel appointment';
              this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
            },
            complete: () => {
              console.log('🔴 Cancel appointment observable completed');
            }
          });

          // Verify subscription was created
          if (!subscription || subscription.closed) {
            console.error('❌ Subscription was not created or is already closed!');
            this.snackBar.open('Error: Failed to initiate cancellation request', 'Close', { duration: 5000 });
            this.cancellingId = null;
          }
        } else {
          console.log('🔴 User cancelled the dialog');
        }
      },
      error: (err) => {
        console.error('❌ Error in dialog afterClosed:', err);
      }
    });
  }
}
