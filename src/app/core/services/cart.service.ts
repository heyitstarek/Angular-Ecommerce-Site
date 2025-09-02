import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth.service';

export type CartItem = { id:number; title:string; price:number; quantity:number; image:string; color?:string };

@Injectable({ providedIn: 'root' })
export class CartService {
  private auth = inject(AuthService);
  cart = signal<CartItem[]>([]);
  count = computed(() => this.cart().length);
  // Sum using integer cents to avoid floating point artifacts (e.g., 949.8100000000001)
  subtotal = computed(() => {
    const cents = this.cart().reduce((s, i) => s + Math.round(i.price * 100) * i.quantity, 0);
    return cents / 100;
  });

  constructor() {
    // Resolve storage key from current user identity (id preferred, then username)
    const storageKey = () => {
      const u = this.auth.user();
      if (u?.id) return `cart:user:${u.id}`;
      const name = this.auth.userName();
      return name ? `cart:user:${name}` : null; // do not persist for guests
    };

    // Load cart for current user on startup
    try {
      const key = storageKey();
      if (key) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          if (Array.isArray(parsed)) this.cart.set(parsed);
        }
      } else {
        // guest: start empty
        this.cart.set([]);
      }
    } catch {}

    // When the logged-in user changes, switch carts accordingly
    let prevKey: string | null = storageKey();
    effect(() => {
      const key = storageKey();
      if (key === prevKey) return;
      prevKey = key;
      try {
        if (key) {
          const raw = localStorage.getItem(key);
          this.cart.set(raw ? (JSON.parse(raw) as CartItem[]) : []);
        } else {
          // on logout, clear in-memory cart so it doesn't stick around
          this.cart.set([]);
        }
      } catch {
        this.cart.set([]);
      }
    });

    // Persist the current cart when it changes, only for logged-in users
    effect(() => {
      const key = storageKey();
      if (!key) return; // skip persisting for guests
      try {
        localStorage.setItem(key, JSON.stringify(this.cart()));
      } catch {}
    });
  }

  add(item: CartItem) {
    const existing = this.cart().find(i => i.id === item.id);
    if (existing) {
      this.cart.update(arr => arr.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
    } else {
      this.cart.update(arr => [...arr, item]);
    }
  }

  remove(id: number) {
    this.cart.update(arr => arr.filter(i => i.id !== id));
  }

  clear() { this.cart.set([]); }


  updateQty(id: number, qty: number) {
    this.cart.update(list =>
      list.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)
    );
  }

  inc(id: number) {
    this.cart.update(list =>
      list.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }

  dec(id: number) {
    this.cart.update(list =>
      list.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i)
    );
  }
}
