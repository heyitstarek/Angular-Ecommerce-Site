import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './auth-navbar.html',
  styleUrls: ['./auth-navbar.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthNavbar {
  private router = inject(Router);

  isLoginRoute = signal(false);
  isRegisterRoute = signal(false);

  constructor() {
    const updateFlags = (url: string) => {
      this.isLoginRoute.set(url.startsWith('/auth/login'));
      this.isRegisterRoute.set(url.startsWith('/auth/register'));
    };
    updateFlags(this.router.url);
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) updateFlags(ev.urlAfterRedirects);
    });
  }

  goLogin() {
    if (this.isLoginRoute()) return;
    this.router.navigateByUrl('/auth/login');
  }

  goRegister() {
    if (this.isRegisterRoute()) return;
    this.router.navigateByUrl('/auth/register');
  }
}
