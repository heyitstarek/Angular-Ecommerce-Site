import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProduct, ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './all-products.html',
})
export class AllProducts {
  private productService = inject(ProductService);
  private cartSvc = inject(CartService);

  products = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchProducts();
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
}
