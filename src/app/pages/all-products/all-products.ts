import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IProduct, ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard ],
  templateUrl: './all-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllProducts {
  private productService = inject(ProductService);
  private cartSvc = inject(CartService);
  private route = inject(ActivatedRoute);

  products = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  view = signal<'all' | 'deals' | 'trending' | 'new'>('all');

  ngOnInit() {
    this.fetchProducts();
    this.route.queryParamMap.subscribe((qp) => {
      const v = (qp.get('view') || 'all') as any;
      this.view.set(['deals','trending','new'].includes(v) ? v : 'all');
    });
  }

  private fetchProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data); // <-- no `.products` anymore
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

  visibleProducts() {
    const list = [...this.products()];
    switch (this.view()) {
      case 'deals':
        return list.sort((a,b) => b.discountPercentage - a.discountPercentage);
      case 'trending':
        return list.sort((a,b) => b.rating - a.rating);
      case 'new':
        return list.slice(-list.length).reverse();
      default:
        return list;
    }
  }
}
