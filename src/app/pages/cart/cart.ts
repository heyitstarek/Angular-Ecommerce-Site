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
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
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
      document.documentElement.style.overflow = '';
    }
  };

  private onCancel = (ev: Event) => {
    ev.preventDefault();
    this.closeDrawer();
  };

  private onBackdropClick = (ev: MouseEvent) => {
    if (!this.isBrowser()) return;
    const dlg = this.drawerEl.nativeElement;
    const panel = dlg.querySelector('.panel') as HTMLElement | null;
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
    document.documentElement.style.overflow = 'hidden'; // lock page scroll
    try { dlg.showModal(); } catch {}
  }

  closeDrawer() {
    if (!this.isBrowser()) return;
    const dlg = this.drawerEl?.nativeElement;
    if (dlg?.open) dlg.close(); // 'close' event will unlock scroll
  }

  remove(id: number) { this.cartSvc.remove(id); }
}
