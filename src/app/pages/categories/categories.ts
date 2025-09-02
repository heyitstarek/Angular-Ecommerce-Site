import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IProduct, ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartSvc = inject(CartService);

  // UI state
  isLoading = signal(true);
  error = signal<string | null>(null);
  products = signal<IProduct[]>([]);
  cat = signal<string>(''); // raw slug from URL, e.g. "home-decoration"

  // public so the template can call it
  formatCategory = (c: string) =>
    c.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());

  ngOnInit() {
    // react to /categories/:cat changes (e.g., when navigating within the app)
    this.route.paramMap.subscribe(params => {
      const slug = params.get('cat') ?? '';
      this.cat.set(slug);
      this.fetch(slug);
      // scroll top for better UX when switching categories
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private fetch(category: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProductsByCategory(category).subscribe({
      next: (items) => {
        this.products.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load category products');
        this.isLoading.set(false);
      }
    });
  }

  addToCart(p: IProduct) {
    this.cartSvc.add({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.thumbnail,
      quantity: 1,
    });
  }
}
