import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'light';
  private themeSubscription?: Subscription;
  mobileMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Close mobile menu on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menuButton = target.closest('.mobile-menu-button');
    const mobileMenu = target.closest('.mobile-menu');

    if (!menuButton && !mobileMenu && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }
}
