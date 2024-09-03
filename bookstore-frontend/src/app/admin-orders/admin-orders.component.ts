import { Component } from '@angular/core';
import { DataAccessService } from '../data-access/data-access.service';
import { Order } from '../data-access/orders';
import moment from 'moment';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss',
})
export class AdminOrdersComponent {
  orders: Order[];
  constructor(public dataAccessService: DataAccessService) {
    this.dataAccessService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }
  formatDate(date: string) {
    return moment(date).format('DD/MM/YYYY HH:mm');
  }
}
