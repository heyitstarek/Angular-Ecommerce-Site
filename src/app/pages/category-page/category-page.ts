import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, IProduct, ICategory } from '../../core/services/product.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-page.html',
})
export class CategoryPage {
  private productService = inject(ProductService);

  isLoading = signal(true);
  error = signal<string | null>(null);

  categories = signal<ICategory[]>([]);
  counts = signal<Record<string, number>>({});

  ngOnInit() {
    this.load();
  }

  formatCategory = (c: string) =>
  c.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());

  private load() {
this.productService.getCategories().subscribe({
  next: (cats) => {
    // First set raw categories; we’ll replace with filtered after counts
    this.categories.set(cats);

    this.productService.getAllProducts().subscribe({
      next: (all) => {
        // tally by category slug
        const tally: Record<string, number> = {};
        for (const c of cats) tally[c.slug] = 0;
        for (const p of all) tally[p.category] = (tally[p.category] ?? 0) + 1;
        this.counts.set(tally);

        // keep only categories with > 0 items
        const filtered = cats.filter(c => (tally[c.slug] ?? 0) > 0);

        // optional: sort by popularity (desc)
        filtered.sort((a, b) => (tally[b.slug] ?? 0) - (tally[a.slug] ?? 0));

        this.categories.set(filtered);
        this.isLoading.set(false);
      },
      error: () => {
        // If all-products fetch fails, at least pre-seed zeros
        const fallback: Record<string, number> = {};
        for (const c of cats) fallback[c.slug] = 0;
        this.counts.set(fallback);
        this.isLoading.set(false);
      }
    });
  },
  error: (err) => {
    console.error(err);
    this.error.set('Failed to load categories');
    this.isLoading.set(false);
  }
});
  }
}
