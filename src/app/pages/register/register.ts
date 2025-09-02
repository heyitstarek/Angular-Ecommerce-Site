import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './register.html'

})
export class Register {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);
  ok = signal(false);

  form = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.ok.set(false);

    const { username, password, email } = this.form.value as any;
    this.api.register({ username, password, email }).subscribe({
      next: () => {
        // Try immediate login using the same credentials (works if API supports it)
        this.api.login({ username, password }).subscribe({
          next: (res) => {
            this.auth.setToken(res.accessToken);
            if (res.refreshToken) this.auth.setRefreshToken(res.refreshToken);
            this.auth.setUserName(username);
            this.api.me().subscribe({
              next: me => { this.auth.user.set(me); this.auth.setUserName(me.firstName || me.username); },
              error: () => { /* ignore */ }
            });
            this.router.navigateByUrl('/');
          },
          error: () => {
            // Fallback: show success and send to login with prefilled username
            this.ok.set(true);
            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/auth/login'], { queryParams: { username } }), 800);
          }
        });
      },
      error: () => {
        this.error.set('Registration failed.');
        this.loading.set(false);
      }
    });
  }
}
