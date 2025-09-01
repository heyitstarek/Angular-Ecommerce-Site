import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IProduct, ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartSvc = inject(CartService);
  

  product = signal<IProduct | null>(null);
  related = signal<IProduct[]>([]);
  images = signal<string[]>([]);
  activeImage = signal<string | null>(null);

  isLoading = signal(true);
  error = signal<string | null>(null);
  rounded = computed(() => Math.round(this.product()?.rating ?? 0));


  ngOnInit() {
    this.route.paramMap.subscribe(pm => {
      const id = Number(pm.get('id'));
      if (Number.isNaN(id)) {
        this.error.set('Invalid product id');
        this.isLoading.set(false);
        return;
      }
      this.fetchProduct(id);
    });
  }

  private fetchProduct(id: number) {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProduct(id).subscribe({
      next: (p) => {
        this.product.set(p);
        const imgs = (p.images?.length ? p.images : [p.thumbnail]).filter(Boolean);
        this.images.set(imgs);
        this.activeImage.set(imgs[0] || null);
        this.fetchRelated(p);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load product');
        this.isLoading.set(false);
      }
    });
  }

  private fetchRelated(p: IProduct) {
    if (!p?.category) {
      this.related.set([]);
      return;
    }
    this.productService.getProductsByCategory(p.category).subscribe({
      next: (list) => {
        // exclude current product, cap to 8
        this.related.set(list.filter(x => x.id !== p.id).slice(0, 8));
      },
      error: (err) => {
        console.warn('Related fetch failed', err);
        this.related.set([]);
      }
    });
  }

  setActive(img: string) {
    this.activeImage.set(img);
  }

  get discountedPrice(): number {
    const p = this.product();
    if (!p) return 0;
    const d = p.discountPercentage || 0;
    return +(p.price * (1 - d / 100)).toFixed(2);
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartSvc.add({
      id: p.id,
      title: p.title,
      price: this.discountedPrice, // use effective price
      image: p.thumbnail || p.images?.[0] || '',
      quantity: 1,
    });
  }
}
