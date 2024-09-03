import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminSingleBookComponent } from './admin-books/admin-single-book/admin-single-book.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BooksComponent } from './books/books.component';
import { BookCardComponent } from './books/book-card/book-card.component';
import { CartComponent } from './cart/cart.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';
import { CookieModule } from 'ngx-cookie';
import { AuthInterceptorService } from './login/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavigationComponent,
    AdminBooksComponent,
    AdminSingleBookComponent,
    BooksComponent,
    BookCardComponent,
    CartComponent,
    AdminOrdersComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CookieModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
