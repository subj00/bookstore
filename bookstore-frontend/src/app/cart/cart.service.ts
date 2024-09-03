import { Injectable } from '@angular/core';
import { Order } from '../data-access/orders';
import { Book } from '../data-access/book';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _order: Order = { products: [] };
  public updateCart: Subject<Book> = new Subject<Book>();
  constructor() {}

  addOrder(order: Order) {
    this._order = order;
  }
  getOrder() {
    return this._order;
  }
  getProductCount() {
    return this._order.products.length;
  }
  addBookToCart(book: Book) {
    const orderBook = this._order.products.find(
      (bookInOrder) => bookInOrder._id === book._id
    );
    if (orderBook) {
      orderBook.quantity++;
    } else {
      this._order.products.push({ ...book, quantity: 1 });
    }
  }
  removeBookFromCart(book: Book) {
    const orderBook = this._order.products.find(
      (bookInOrder) => bookInOrder._id === book._id
    );
    if (orderBook && orderBook.quantity > 1) {
      orderBook.quantity--;
    } else {
      this._order.products = this._order.products.filter(
        (bookInOrder) => bookInOrder._id !== book._id
      );
    }
  }
  clearCart() {
    this._order = { products: [] };
  }
}
