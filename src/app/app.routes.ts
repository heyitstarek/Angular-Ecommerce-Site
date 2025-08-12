import { Routes } from '@angular/router';
import { AuthNavbar } from './layout/auth-navbar/auth-navbar';
import { Navbar } from './layout/navbar/navbar';
import { Notfound } from './shared/notfound/notfound';

export const routes: Routes = [
  {
    path: '',
    component: AuthNavbar,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login',    loadComponent: () => import('./pages/login/login').then(m => m.Login) },
      { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
    ],
  },

  {
    path: '',
    component: Navbar,
    children: [
      { path: 'home',       loadComponent: () => import('./pages/home/home-page/home-page').then(m => m.HomePage) },
      { path: 'categories', loadComponent: () => import('./pages/categories/categories').then(m => m.Categories) },
      { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
      { path: 'cart',       loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
    ],
  },

  { path: '**', component: Notfound },
];