import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { Doctor } from '../../models/appointment.model';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: Doctor[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  minDateTime = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      appointmentDateTime: ['', Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(500)]]
    });

    // Set minimum datetime to now
    this.setMinDateTime();
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  setMinDateTime(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute in future
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  loadDoctors(): void {
    this.appointmentService.getDoctors().subscribe({
      next: (doctors) => {
        console.log('Doctors loaded:', doctors);
        this.doctors = doctors;
      },
      error: (error) => {
        console.error('Failed to load doctors:', error);
        this.errorMessage = 'Failed to load doctors. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.appointmentForm.value;

      // Convert datetime-local to ISO format for backend
      if (formValue.appointmentDateTime) {
        formValue.appointmentDateTime = formValue.appointmentDateTime + ':00';
      }

      console.log('Submitting appointment:', formValue);

      this.appointmentService.createAppointment(formValue).subscribe({
        next: () => {
          this.successMessage = 'Appointment booked successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/my-appointments']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error booking appointment:', error);
          this.errorMessage = error.error?.message || 'Failed to book appointment. Please try again.';
        }
      });
    }
  }
}
