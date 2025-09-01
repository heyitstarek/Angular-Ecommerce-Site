import { Injectable, signal, computed } from '@angular/core';

export type CartItem = { id:number; title:string; price:number; quantity:number; image:string; color?:string };

@Injectable({ providedIn: 'root' })
export class CartService {
  cart = signal<CartItem[]>([]);
  count = computed(() => this.cart().length);
  subtotal = computed(() => this.cart().reduce((s,i)=>s + i.price * i.quantity, 0));

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