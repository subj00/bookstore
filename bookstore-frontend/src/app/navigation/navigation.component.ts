import { Component, ViewChild } from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { DataAccessService } from '../data-access/data-access.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  @ViewChild('appCart') cart: CartComponent;
  cartOpened = false;
  isAdmin = false;
  isLogged = false;
  productNumber: number = 0;
  toggleCart() {
    this.cartOpened = !this.cartOpened;
    this.cart.refreshCart();
  }
  constructor(
    private dataAccessService: DataAccessService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {
    this.router.events.subscribe(() => {
      this.isAdmin = this.dataAccessService.getUser()?.isAdmin || false;
      this.isLogged = !!this.dataAccessService.getUser();
      console.log(this.isAdmin, this.isLogged);
    });
    this.cartService.updateCart.subscribe(() => {
      this.productNumber = this.cartService.getProductCount();
    });
  }
  ngOnInit() {}
  ngOnChanges() {}
  loggout() {
    this.dataAccessService.logoutUser();
    this.isLogged = false;
    this.cartService.clearCart();
    this.cartService.updateCart.next({});
  }
}
