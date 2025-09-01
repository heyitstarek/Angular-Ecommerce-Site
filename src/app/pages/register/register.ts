import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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

    this.api.register(this.form.value as any).subscribe({
      next: () => {
        this.ok.set(true);
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 600);
      },
      error: () => {
        this.error.set('Registration failed.'); // DummyJSON simulates the add; fields are not strictly validated
        this.loading.set(false);
      }
    });
  }
}
