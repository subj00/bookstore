import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminSingleBookComponent } from './admin-books/admin-single-book/admin-single-book.component';
import { BooksComponent } from './books/books.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'books',
    component: BooksComponent,
  },
  {
    path: 'admin/books',
    component: AdminBooksComponent,
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
  },
  {
    path: 'admin/books/:id',
    component: AdminSingleBookComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin/login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
