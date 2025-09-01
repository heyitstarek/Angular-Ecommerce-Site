import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProduct } from '../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input() product!: IProduct;
  @Output() add = new EventEmitter<IProduct>();

  addToCart() {
    this.add.emit(this.product);
  }
}
