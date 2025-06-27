import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: { [type: string]: any[] } = {}; // 👈 Kunci diubah jadi per-tipe
  private orderType = '';

  constructor() {
    this.loadCartFromStorage();
    this.loadOrderTypeFromStorage();
  }

  addItemToCart(item: any) {
    const type = this.orderType;
    if (!this.items[type]) {
      this.items[type] = [];
    }

    const existing = this.items[type].find(i => i.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      this.items[type].push({ ...item, qty: 1 });
    }

    this.saveCartToStorage();
  }

  decreaseItemQty(item: any) {
    const type = this.orderType;
    if (!this.items[type]) return;

    const existing = this.items[type].find(i => i.id === item.id);
    if (existing) {
      existing.qty--;
      if (existing.qty <= 0) {
        this.items[type] = this.items[type].filter(i => i.id !== item.id);
      }
      this.saveCartToStorage();
    }
  }

  removeItemById(id: number) {
    const type = this.orderType;
    if (this.items[type]) {
      this.items[type] = this.items[type].filter(i => i.id !== id);
      this.saveCartToStorage();
    }
  }

  getCartItems() {
    const type = this.orderType;
    return this.items[type] || [];
  }

  getCartItemsByType(type: string) {
    return this.items[type] || [];
  }

  setOrderType(type: string) {
    this.orderType = type;
    localStorage.setItem('orderType', type);
  }

  getOrderType() {
    return this.orderType;
  }

  private saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  private loadCartFromStorage() {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  }

  private loadOrderTypeFromStorage() {
    const savedType = localStorage.getItem('orderType');
    if (savedType) {
      this.orderType = savedType;
    }
  }

  clearCart() {
    const type = this.orderType;
    if (this.items[type]) {
      this.items[type] = [];
      this.saveCartToStorage();
    }
  }
}
