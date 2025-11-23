import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';

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

interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div class="tabs">
        <button
          class="tab-button"
          [class.active]="activeTab === 'statistics'"
          (click)="activeTab = 'statistics'">
          Statistics
        </button>
        <button
          class="tab-button"
          [class.active]="activeTab === 'users'"
          (click)="activeTab = 'users'">
          Users
        </button>
      </div>

      <!-- Statistics Tab -->
      <div *ngIf="activeTab === 'statistics'" class="tab-content">
        <h2>System Statistics</h2>

        <div class="statistics-grid">
          <div class="stat-card">
            <h3>Total Users</h3>
            <p class="stat-value">{{ statistics.totalUsers }}</p>
          </div>
          <div class="stat-card">
            <h3>Total Appointments</h3>
            <p class="stat-value">{{ statistics.totalAppointments }}</p>
          </div>
          <div class="stat-card">
            <h3>Doctors</h3>
            <p class="stat-value">{{ statistics.totalDoctors }}</p>
          </div>
          <div class="stat-card">
            <h3>Patients</h3>
            <p class="stat-value">{{ statistics.totalPatients }}</p>
          </div>
          <div class="stat-card pending">
            <h3>Pending</h3>
            <p class="stat-value">{{ statistics.pendingAppointments }}</p>
          </div>
          <div class="stat-card approved">
            <h3>Approved</h3>
            <p class="stat-value">{{ statistics.approvedAppointments }}</p>
          </div>
          <div class="stat-card rejected">
            <h3>Rejected</h3>
            <p class="stat-value">{{ statistics.rejectedAppointments }}</p>
          </div>
          <div class="stat-card cancelled">
            <h3>Cancelled</h3>
            <p class="stat-value">{{ statistics.cancelledAppointments }}</p>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div *ngIf="activeTab === 'users'" class="tab-content">
        <h2>All System Users</h2>

        <div *ngIf="users.length === 0" class="no-data">
          No users found
        </div>

        <!-- Mobile Card View -->
        <div class="users-cards mobile-view">
          <div *ngFor="let user of users" class="user-card">
            <div class="card-item">
              <span class="card-label">ID:</span>
              <span class="card-value">{{ user.id }}</span>
            </div>
            <div class="card-item">
              <span class="card-label">Username:</span>
              <span class="card-value">{{ user.username }}</span>
            </div>
            <div class="card-item">
              <span class="card-label">Email:</span>
              <span class="card-value">{{ user.email }}</span>
            </div>
            <div class="card-item">
              <span class="card-label">Role:</span>
              <span class="role-badge" [ngClass]="'role-' + user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
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

    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--color-primary);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .stat-card h3 {
      margin: 0 0 12px 0;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
      color: var(--text-color);
    }

    .stat-card.pending::before {
      background: #ffd166;
    }

    .stat-card.approved::before {
      background: var(--color-success);
    }

    .stat-card.rejected::before {
      background: var(--color-error);
    }

    .stat-card.cancelled::before {
      background: var(--text-secondary);
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

    .users-table {
      background: var(--surface-color);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: var(--bg-color);
      border-bottom: 2px solid var(--border-color);
    }

    th {
      padding: 16px;
      text-align: left;
      color: var(--text-color);
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-color);
      font-size: 14px;
    }

    tbody tr {
      transition: background-color 0.2s ease;
    }

    tbody tr:hover {
      background: var(--bg-color);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .role-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-badge.role-admin {
      background: rgba(17, 138, 178, 0.2);
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
    }

    .role-badge.role-doctor {
      background: rgba(6, 214, 160, 0.2);
      color: var(--color-success);
      border: 1px solid var(--color-success);
    }

    .role-badge.role-patient {
      background: rgba(255, 209, 102, 0.2);
      color: #ffd166;
      border: 1px solid #ffd166;
    }

    .desktop-view {
      display: block;
    }

    .mobile-view {
      display: none;
    }

    .users-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .user-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .card-label {
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      min-width: 70px;
    }

    .card-value {
      color: var(--text-color);
      font-size: 14px;
      word-break: break-all;
      flex: 1;
      text-align: right;
    }

    @media (max-width: 768px) {
      .admin-dashboard {
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

      .statistics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .stat-card {
        padding: 16px;
      }

      .stat-card h3 {
        font-size: 12px;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 24px;
      }

      .desktop-view {
        display: none;
      }

      .mobile-view {
        display: grid;
      }

      .users-cards {
        grid-template-columns: 1fr;
      }

      .user-card {
        padding: 14px;
        gap: 10px;
      }

      .card-label {
        min-width: 60px;
        font-size: 12px;
      }

      .card-value {
        font-size: 13px;
      }

      .role-badge {
        padding: 4px 10px;
        font-size: 11px;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'statistics' | 'users' = 'statistics';
  statistics: StatisticsResponse = {
    totalUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    rejectedAppointments: 0,
    cancelledAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0
  };
  users: UserResponse[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadUsers();
  }

  loadStatistics(): void {
    this.appointmentService.getStatistics().subscribe({
      next: (data: StatisticsResponse) => {
        this.statistics = data;
      },
      error: (err: any) => console.error('Error loading statistics:', err)
    });
  }

  loadUsers(): void {
    this.appointmentService.getUsers().subscribe({
      next: (data: UserResponse[]) => {
        this.users = data;
      },
      error: (err: any) => console.error('Error loading users:', err)
    });
  }
}



