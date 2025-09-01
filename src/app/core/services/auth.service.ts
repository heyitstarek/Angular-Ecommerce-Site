import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser = typeof window !== 'undefined';

  // Full user profile (/auth/me)
  user = signal<{ id:number; username:string; email?:string; firstName?:string; lastName?:string; image?:string } | null>(null);

  // Greeting fallback (used before /auth/me arrives)
  userName = signal<string | null>(null);

  constructor() {
    if (this.isBrowser) {
      this.userName.set(localStorage.getItem('username'));
    }
  }

  // Access token
  setToken(token: string) { if (this.isBrowser) localStorage.setItem('accessToken', token); }
  getToken(): string | null { return this.isBrowser ? localStorage.getItem('accessToken') : null; }
  removeToken() { if (this.isBrowser) localStorage.removeItem('accessToken'); }

  // Refresh token
  setRefreshToken(token: string) { if (this.isBrowser) localStorage.setItem('refreshToken', token); }
  getRefreshToken(): string | null { return this.isBrowser ? localStorage.getItem('refreshToken') : null; }
  removeRefreshToken() { if (this.isBrowser) localStorage.removeItem('refreshToken'); }

  // Greeting helpers
  setUserName(name: string) {
    if (this.isBrowser) localStorage.setItem('username', name);
    this.userName.set(name);
  }
  clearUserName() {
    if (this.isBrowser) localStorage.removeItem('username');
    this.userName.set(null);
  }

  isLoggedIn() { return !!this.getToken(); }

  logout() {
    this.removeToken();
    this.removeRefreshToken();
    this.clearUserName();
    this.user.set(null);
  }
}
