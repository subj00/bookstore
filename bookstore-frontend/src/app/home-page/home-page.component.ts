import { Component } from '@angular/core';
import { Book } from '../data-access/book';
import { DataAccessService } from '../data-access/data-access.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  books: Book[];
  constructor(private dataAccessService: DataAccessService) {
    this.dataAccessService.getBooks().subscribe((books) => {
      const randomStart = this.getRandomNumber(0, books.length - 3);

      this.books = books.slice(randomStart, randomStart + 3);
    });
  }
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
