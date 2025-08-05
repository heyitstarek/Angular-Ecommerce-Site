import { IProduct } from './../../core/services/product.service';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input() product!: IProduct;
}
