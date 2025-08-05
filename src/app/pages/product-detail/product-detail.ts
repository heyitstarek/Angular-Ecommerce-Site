import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProduct, ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  product!: IProduct;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
