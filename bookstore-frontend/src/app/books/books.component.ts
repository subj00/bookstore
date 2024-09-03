import { Component } from '@angular/core';
import { DataAccessService } from '../data-access/data-access.service';
import { Book } from '../data-access/book';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  books: Book[] = [];
  constructor(
    public dataAccessService: DataAccessService,
    public cartService: CartService
  ) {
    this.dataAccessService.getBooks().subscribe((books) => {
      this.books = books;
    });
  }
  handleAddToCart(book: Book) {
    this.cartService.addBookToCart(book);
    this.cartService.updateCart.next(book);
  }
}
