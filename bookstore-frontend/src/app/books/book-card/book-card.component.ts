import { Component, Input, Output, output } from '@angular/core';
import { Book } from '../../data-access/book';
import { DataAccessService } from '../../data-access/data-access.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  @Input() book: Book = {};
  @Input() showFullImg = false;
  @Output() addToCart: Subject<Book> = new Subject<Book>();
  constructor(public dataAccessService: DataAccessService) {}

  onCartClick() {
    this.addToCart.next(this.book);
  }
}
