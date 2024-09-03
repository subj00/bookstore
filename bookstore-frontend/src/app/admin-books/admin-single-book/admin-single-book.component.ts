import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataAccessService } from '../../data-access/data-access.service';
import { Author } from '../../data-access/authors';
import { Book } from '../../data-access/book';
import { CrudMode } from '../../data-access/crud-mode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-single-book',
  templateUrl: './admin-single-book.component.html',
  styleUrl: './admin-single-book.component.scss',
})
export class AdminSingleBookComponent {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  authors: Author[] = [];
  selectedAuthor: Author | null = null;

  book: Book = {};
  crudFormMode = CrudMode.CREATE;

  constructor(
    public dataAccessService: DataAccessService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      if (params['id'] === 'novi') {
        this.crudFormMode = CrudMode.CREATE;
        this.dataAccessService.getAuthors().subscribe((authors) => {
          this.authors = authors;
        });
      } else {
        this.crudFormMode = CrudMode.EDIT;
        this.dataAccessService.getAuthors().subscribe((authors) => {
          this.authors = authors;

          this.dataAccessService.getBook(params['id']).subscribe((book) => {
            this.book = book;
            this.selectedAuthor = authors.find(
              (author: Author) => author._id === book.author._id
            );
          });
        });
      }
    });
  }

  addBook() {
    if (this.selectedAuthor) {
      this.book.author = this.selectedAuthor._id;
      this.dataAccessService.addBook(this.book).subscribe((res) => {
        console.log(res);
        window.history.back();
      });
    } else {
      alert('Please select an author');
    }
  }
  editBook() {
    if (this.selectedAuthor) {
      this.book.author = this.selectedAuthor._id;
      this.dataAccessService
        .patchBook(this.book._id!, this.book)
        .subscribe((res) => {
          console.log(res);
          window.history.back();
        });
    } else {
      alert('Please select an author');
    }
  }
  openFileUpload() {
    this.fileInput?.nativeElement.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFileName = input.files[0].name;
      // You can also process the file here
      this.dataAccessService.uploadImage(input.files[0]).subscribe((res) => {
        console.log(res);
        this.book.imgUrl = res;
      });
    }
  }
  goBack() {
    window.history.back();
  }
  get isEditMode() {
    return this.crudFormMode === CrudMode.EDIT;
  }
}
