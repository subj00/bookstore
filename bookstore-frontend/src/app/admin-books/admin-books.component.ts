import { Component } from '@angular/core';
import { DataAccessService } from '../data-access/data-access.service';
import { Book } from '../data-access/book';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.scss',
})
export class AdminBooksComponent {
  books: Book[] = [];
  constructor(public dataAccessService: DataAccessService) {
    this.dataAccessService.getBooks().subscribe((books) => {
      this.books = books;
    });
  }

  deleteBook(id: string) {}
}
