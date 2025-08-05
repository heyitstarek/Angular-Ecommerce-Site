import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProduct, ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.html',
})
export class HomePage {
  products = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor(private productService: ProductService) {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }
}
