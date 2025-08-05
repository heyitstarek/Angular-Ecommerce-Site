import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home-page/home-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail').then(
        (m) => m.ProductDetail
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart').then((m) => m.Cart),
  },
  { path: '**', redirectTo: '' },
];
