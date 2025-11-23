import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  loginError: string = '';
  currentTheme: Theme = 'light';
  private themeSubscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    this.loginError = '';

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirect based on user role
          const role = response.role;
          if (role === 'DOCTOR') {
            this.router.navigate(['/doctor-dashboard']);
          } else if (role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            // Default to patient route
            this.router.navigate(['/book-appointment']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || error.message || 'Login failed. Please check your username and password.';
          this.loginError = errorMessage;

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
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName === 'username' ? 'Username' : 'Password'} is required`;
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }
}
