import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  registerError: string = '';
  currentTheme: Theme = 'light';
  private themeSubscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{8,}$/)]]
    });
  }

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    this.registerError = '';

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // New users register as PATIENT, so redirect to book-appointment
          this.router.navigate(['/book-appointment']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || error.message || 'Registration failed. Please try again.';
          this.registerError = errorMessage;

          // Show snackbar with error styling
          this.snackBar.open(
            errorMessage,
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      const fieldLabels: { [key: string]: string } = {
        'username': 'Username',
        'email': 'Email',
        'password': 'Password',
        'phone': 'Phone number'
      };
      return `${fieldLabels[fieldName] || fieldName} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
}
