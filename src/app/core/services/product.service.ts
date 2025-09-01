// product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
interface ProductListResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}
export interface ICategory {
  slug: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private api = environment.api;

  // fetch all products
  getProducts(): Observable<IProduct[]> {
    return this.http
      .get<ProductListResponse>(`${this.api}/products`)
      .pipe(map(res => res.products));
  }

  //  single product
  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.api}/products/${id}`);
  }

  //  categories
  getCategories(): Observable<ICategory[]> {
    return this.http.get<any[]>(`${this.api}/products/categories`).pipe(
      map(arr =>
        arr.map((c: any) => {
          if (typeof c === 'string') {
            const name = c.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
            return { slug: c, name };
          }
          const slug = c.slug ?? '';
          const name = c.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase());
          return { slug, name };
        })
      )
    );
  }
  getAllProducts(): Observable<IProduct[]> {
    return this.http
      .get<{ products: IProduct[]; total: number; skip: number; limit: number }>(
        `${this.api}/products?limit=0` // fallback to ?limit=200 if 0 doesn't work
      )
      .pipe(map(res => res.products));
  }
  //  products by category
  getProductsByCategory(category: string): Observable<IProduct[]> {
    return this.http
      .get<ProductListResponse>(`${this.api}/products/category/${category}`)
      .pipe(map(res => res.products));
  }

  //  search products
  searchProducts(query: string): Observable<IProduct[]> {
    return this.http
      .get<ProductListResponse>(`${this.api}/products/search?q=${query}`)
      .pipe(map(res => res.products));
  }
}