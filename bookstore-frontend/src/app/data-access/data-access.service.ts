import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author } from './authors';
import { map } from 'rxjs';
import { Book } from './book';
import { Order } from './orders';
import { User } from './user';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  basePath = 'http://localhost:3000';
  assetsPrefix = 'http://localhost:3000/uploads/';
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(user: User) {
    return this.http.post<any>(`${this.basePath}/user/login`, user);
  }
  register(user: User) {
    return this.http.post<any>(`${this.basePath}/user/signup`, user);
  }
  storeUser(user: User) {
    this.cookieService.putObject('user', user);
  }
  logoutUser() {
    this.cookieService.remove('user');
    this.cookieService.remove('accessTokenBook');
  }
  getUser() {
    return this.cookieService.getObject('user') as User;
  }
  getBooks() {
    return this.http
      .get<any>(`${this.basePath}/products`)
      .pipe(map((res) => res.products));
  }
  getBook(id: string) {
    return this.http
      .get<any>(`${this.basePath}/products/${id}`)
      .pipe(map((res) => res.product));
  }
  patchBook(id: string, book: Book) {
    return this.http.patch(`${this.basePath}/products/${id}`, book);
  }
  getAuthors() {
    return this.http
      .get<any>(`${this.basePath}/author`)
      .pipe(map((res) => res.products));
  }
  addBook(Book: Book) {
    return this.http.post(`${this.basePath}/products`, Book);
  }
  addOrders(order: Order) {
    return this.http.post(`${this.basePath}/orders`, order);
  }
  getOrders() {
    return this.http
      .get<any>(`${this.basePath}/orders`)
      .pipe(map((res) => res.orders));
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http
      .post<any>(`${this.basePath}/uploads`, formData)
      .pipe(map((res) => res.data.url));
  }
  getImgPath(book: Book | undefined) {
    return book?.imgUrl
      ? `${this.assetsPrefix}${book.imgUrl}`
      : 'assets/cover.png';
  }
}
