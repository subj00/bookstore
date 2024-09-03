import { Component } from '@angular/core';
import { DataAccessService } from '../data-access/data-access.service';
import { User } from '../data-access/user';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import e from 'cors';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user: User = {};
  isRegister = false;
  constructor(
    private dataAccessService: DataAccessService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  authAction() {
    this.isRegister ? this.register() : this.login();
  }
  login() {
    if (window.location.href.includes('admin')) {
      this.user.isAdmin = true;
    }
    this.dataAccessService
      .login(this.user)
      .pipe(
        catchError((error) => {
          alert('Error with login:' + error?.error?.message);
          return throwError(error);
        })
      )
      .subscribe((res) => {
        this.cookieService.put('accessTokenBook', res.token);
        if (window.location.href.includes('admin')) {
          this.dataAccessService.storeUser({
            ...res.user,
            isAdmin: true,
          } as User);
          this.router.navigate(['/admin/books']);
        } else {
          this.dataAccessService.storeUser(res.user as User);
          this.router.navigate(['/']);
        }
      });
  }
  register() {
    if (window.location.href.includes('admin')) {
      this.user.isAdmin = true;
    }
    this.dataAccessService
      .register(this.user)
      .pipe(
        catchError((error) => {
          alert('Error with registration:' + error?.error?.message);
          return throwError(error);
        })
      )
      .subscribe((res) => {
        this.isRegister = false;
      });
  }
  toggleLoginRegister() {
    this.isRegister = !this.isRegister;
    this.cookieService.remove('accessTokenBook', { path: '/' });
  }
}
