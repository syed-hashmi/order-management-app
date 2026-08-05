import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { CustomerService } from '../customers/services/customer-service';
import { ProductService } from '../products/services/product-service';
import { forkJoin } from 'rxjs';
import { OrderService } from '../orders/services/order-service';
import { OrdersList } from '../orders/orders-list/orders-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../shared/services/notification-service';

@Component({
  selector: 'app-dashboard',
  imports: [MatCard, MatCardTitle, MatCardContent, OrdersList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  totalCustomers: number = 0;
  totalProducts: number = 0;
  totalOrders: number = 0;

  private readonly PAGE = 1;
  private readonly PAGE_SIZE = 5;


  constructor(private customerService: CustomerService,
    private productService: ProductService,
    private orderService: OrderService,
    private destroyRef: DestroyRef,
    private notificationService: NotificationService
  ) {
  }
  ngOnInit(): void {
    this.getTotalCount();
  }

  private getTotalCount(): void {
    forkJoin({
      customers: this.customerService.getCustomers(this.PAGE, this.PAGE_SIZE),
      products: this.productService.getProducts(this.PAGE, this.PAGE_SIZE),
      orders: this.orderService.getOrders(this.PAGE, this.PAGE_SIZE)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        {
          next: ({ customers, products, orders }) => {
            this.totalCustomers = Number(customers.headers.get('X-Total-Count') ?? 0);
            this.totalProducts = Number(products.headers.get('X-Total-Count') ?? 0);
            this.totalOrders = Number(orders.headers.get('X-Total-Count') ?? 0);
          },
          error: () => {
            this.notificationService.error('Failed to load dashboard data.');
          }
        }
      );
  }
}
