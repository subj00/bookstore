import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { Order } from '../data-access/orders';
import { DataAccessService } from '../data-access/data-access.service';
import { Book } from '../data-access/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  constructor(
    public cartService: CartService,
    public dataAccessService: DataAccessService,
    private router: Router
  ) {
    this.cartService.updateCart.subscribe(() => {
      this.refreshCart();
    });
  }
  order: Order = { products: [] };
  fullSum: number = 0;
  ngOnInit() {
    this.refreshCart();
  }

  refreshCart() {
    this.order = this.cartService.getOrder();
    this.fullSum = this.order.products.reduce((acc, book) => {
      return acc + (book.price || 0) * book.quantity;
    }, 0);
  }
  increaseQuantityForBook(book: Book) {
    this.cartService.addBookToCart(book);
    this.refreshCart();
  }
  decreaseQuantityForBook(book: Book) {
    this.cartService.removeBookFromCart(book);
    this.refreshCart();
  }
  createOrder() {
    if (!this.dataAccessService.getUser()) {
      alert('Please login to create an order');
      this.router.navigate(['/login']);
    }
    this.dataAccessService
      .addOrders(this.cartService.getOrder())
      .subscribe(() => {
        this.cartService.clearCart();
        this.cartService.updateCart.next({});
        alert('Order created');
      });
  }
}
