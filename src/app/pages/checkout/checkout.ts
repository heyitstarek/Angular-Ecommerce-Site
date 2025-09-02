import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html'
})
export class CheckoutPage {
  cartSvc = inject(CartService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ok = signal(false);
  delivery = signal<'standard' | 'express'>('standard');
  submitted = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    country: [''],
    address: ['', Validators.required],
    city: [''],
    state: [''],
    zip: [''],
    // Payment
    cardName: ['', Validators.required],
    cardNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9 ]{13,23}$/) // simple length check allowing spaces
      ]
    ],
    cardExpiry: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/) // MM/YY
      ]
    ],
    cardCvc: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{3,4}$/)
      ]
    ]
  });

  setDelivery(mode: 'standard' | 'express') { this.delivery.set(mode); }

  total() {
    const base = this.cartSvc.subtotal();
    const shipping = this.delivery() === 'express' ? 9.99 : 0;
    return base + shipping;
  }

  placeOrder() {
    this.submitted.set(true);
    if (this.form.invalid || this.cartSvc.count() === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.ok.set(true);
    // demo: clear cart and navigate after a short delay
    setTimeout(() => {
      this.cartSvc.clear();
      this.router.navigate(['/home']);
    }, 1000);
  }
}
