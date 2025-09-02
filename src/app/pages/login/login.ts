import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor() {
    // Prefill username if provided via query (?username=...)
    const u = this.route.snapshot.queryParamMap.get('username');
    if (u) this.form.patchValue({ username: u });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true); this.error.set(null);

    this.api.login(this.form.value as any).subscribe({
      next: (res) => {
        // store tokens
        this.auth.setToken(res.accessToken);
        if (res.refreshToken) this.auth.setRefreshToken(res.refreshToken);

        // fallback greeting immediately (typed username)
        this.auth.setUserName(this.form.value.username as string);

        // load real profile (firstName/username)
        this.api.me().subscribe({
          next: (me) => {
            this.auth.user.set(me);
            this.auth.setUserName(me.firstName || me.username);
          },
          error: () => { /* ignore; fallback greeting stays */ }
        });

        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/';
        this.router.navigateByUrl(redirect);
      },
      error: () => {
        this.error.set('Invalid credentials or server error.');
        this.loading.set(false);
      }
    });
  }
}
