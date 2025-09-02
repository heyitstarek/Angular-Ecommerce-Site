import { 
  Component, 
  ElementRef, 
  ViewChild, 
  CUSTOM_ELEMENTS_SCHEMA, 
  AfterViewInit, 
  OnDestroy, 
  PLATFORM_ID, 
  inject 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Cart implements AfterViewInit, OnDestroy {
  constructor(public cartSvc: CartService) {}

  @ViewChild('drawerEl', { static: true }) drawerEl!: ElementRef<HTMLDialogElement>;
  private platformId = inject(PLATFORM_ID);

  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  private onClose = () => {
    if (this.isBrowser()) {
      // Ensure both html and body scroll are restored
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  };

  private onCancel = (ev: Event) => {
    ev.preventDefault();
    this.closeDrawer();
  };

  private onBackdropClick = (ev: MouseEvent) => {
    if (!this.isBrowser()) return;
    const dlg = this.drawerEl.nativeElement;
    // Close only when clicking outside of the visible content panel
    const panel = dlg.querySelector('el-dialog-panel') as HTMLElement | null;
    if (panel && !panel.contains(ev.target as Node)) {
      this.closeDrawer();
    }
  };

  ngAfterViewInit() {
    if (!this.isBrowser()) return;
    const dlg = this.drawerEl.nativeElement;
    dlg.addEventListener('close', this.onClose);
    dlg.addEventListener('cancel', this.onCancel);
    dlg.addEventListener('click', this.onBackdropClick);
  }

  ngOnDestroy() {
    if (!this.isBrowser()) return;
    const dlg = this.drawerEl?.nativeElement;
    if (dlg) {
      dlg.removeEventListener('close', this.onClose);
      dlg.removeEventListener('cancel', this.onCancel);
      dlg.removeEventListener('click', this.onBackdropClick);
    }
    // safety: ensure scroll unlocked if component goes away
    document.documentElement.style.overflow = '';
  }

  openDrawer() {
    if (!this.isBrowser()) return;
    const dlg = this.drawerEl?.nativeElement;
    if (!dlg || dlg.open) return;
    // lock page scroll (set on both html and body for reliability)
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    try { dlg.showModal(); } catch {}
  }

  closeDrawer() {
    if (!this.isBrowser()) return;
    const dlg = this.drawerEl?.nativeElement;
    if (dlg?.open) dlg.close();
    // Also immediately restore scroll in case 'close' event is missed
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  remove(id: number) { this.cartSvc.remove(id); }

  private router = inject(Router);
  goCheckout() {
    if (this.cartSvc.count() === 0) return;
    this.closeDrawer();
    this.router.navigate(['/checkout']);
  }
}
