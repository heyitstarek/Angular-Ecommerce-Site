import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProduct, ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home-page.html',
})
export class HomePage {
  private productService = inject(ProductService);
  private cartSvc = inject(CartService);

  isLoading = signal(true);
  error = signal<string | null>(null);

  categories = signal<string[]>([]);
  catProducts = signal<Record<string, IProduct[]>>({});

  // real DummyJSON categories; tweak to your taste
  featured = signal<string[]>(['smartphones', 'laptops', 'fragrances', 'womens-dresses']);

  trending = signal<IProduct[]>([]);
  newArrivals = signal<IProduct[]>([]);
  bestDeals = signal<IProduct[]>([]);

  ngOnInit() {
    this.loadHome();
  }

  public formatCategory(cat: string) {
  // "home-decoration" -> "Home Decoration"
    return cat
      .replace(/-/g, ' ')
      .replace(/\b\w/g, ch => ch.toUpperCase());
  }


private loadHome() {
  this.isLoading.set(true);
  this.error.set(null);

  this.productService.getProducts().subscribe({
    next: (all) => {
      // gather unique categories from the dataset you actually received
      const cats = Array.from(new Set(all.map(p => p.category)));
      this.categories.set(cats);

      // your preferred order (can include items that might be missing)
      const preferredOrder = [
        'smartphones', 'laptops', 'womens-dresses', 'mens-shirts',
        'fragrances', 'skincare', 'groceries', 'home-decoration',
        'furniture', 'tops'
      ];

      // keep only those that are actually available in this dataset
      const availablePreferred = preferredOrder.filter(c => cats.includes(c));

      // choose up to 4: prefer your order, otherwise just take first 4 from available cats
      const chosen = (availablePreferred.length ? availablePreferred : cats).slice(0, 4);
      this.featured.set(chosen);

      // build featured sections (only real categories -> non-empty lists)
      const record: Record<string, IProduct[]> = {};
      for (const cat of chosen) {
        const items = all.filter(p => p.category === cat).slice(0, 4);
        if (items.length) record[cat] = items;
      }
      this.catProducts.set(record);

      // other sections
      this.trending.set([...all].sort((a, b) => b.rating - a.rating).slice(0, 4));
      this.newArrivals.set([...all].slice(-4));
      this.bestDeals.set([...all].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 4));

      this.isLoading.set(false);
    },
    error: (err) => {
      console.error(err);
      this.error.set('Failed to load products');
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

  itemsOf(cat: string) {
    return this.catProducts()[cat] ?? [];
  }
}
