import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Cart } from '../../pages/cart/cart';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLink, Cart],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Navbar {
  private cartSvc = inject(CartService);
  private router = inject(Router);
  auth = inject(AuthService);

  @ViewChild(Cart, { static: true }) cartDrawer!: Cart;

  cartCount = this.cartSvc.count;

  openDrawer = () => this.cartDrawer?.openDrawer();
  closeDrawer = () => this.cartDrawer?.closeDrawer();

  goLogin()    { this.router.navigateByUrl('/auth/login'); }
  goRegister() { this.router.navigateByUrl('/auth/register'); }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
