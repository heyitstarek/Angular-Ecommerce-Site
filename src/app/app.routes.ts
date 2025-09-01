import { CategoryPage } from './pages/category-page/category-page';
import { Routes } from '@angular/router';
import { AuthNavbar } from './layout/auth-navbar/auth-navbar';
import { Navbar } from './layout/navbar/navbar';
import { Notfound } from './shared/notfound/notfound';
import { guestGuard } from './core/guards/guest.guard-guard';

export const routes: Routes = [
  // Short links so /login and /register don't 404 (do NOT remove)
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },

  // Auth layout (guest-only)
  {
    path: 'auth',
    component: AuthNavbar,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login',    canActivate: [guestGuard], loadComponent: () => import('./pages/login/login').then(m => m.Login) },
      { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./pages/register/register').then(m => m.Register) },
    ],
  },

  // Main layout
  {
    path: '',
    component: Navbar,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home',            loadComponent: () => import('./pages/home/home-page').then(m => m.HomePage) },
      { path: 'categories',      loadComponent: () => import('./pages/category-page/category-page').then(m => m.CategoryPage) },
      { path: 'categories/:cat', loadComponent: () => import('./pages/categories/categories').then(m => m.Categories) },
      { path: 'all-products',    loadComponent: () => import('./pages/all-products/all-products').then(m => m.AllProducts) },
      { path: 'products/:id',    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
    ],
  },

  // 404
  { path: '**', component: Notfound },
];
