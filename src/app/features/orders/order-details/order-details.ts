import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NotificationService } from '../../../shared/services/notification-service';
import { OrderService } from '../services/order-service';
import { Order, OrderItem } from '../services/models/order.model';
import { CustomerService } from '../../customers/services/customer-service';
import { Customer } from '../../customers/services/models/customer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss'
})
export class OrderDetails implements OnInit {

  displayedColumns: string[] = [
    'productId',
    'productName',
    'quantity',
    'unitPrice',
    'total'
  ];

  orderId!: number;
  order!: Order;
  items: OrderItem[] = [];
  customer: Customer | null = null;
  private returnUrl = '/orders';


  constructor(
    private route: ActivatedRoute,
    private notification: NotificationService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {
    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') ?? '/orders';
  }

  ngOnInit(): void {
    this.subscribeToParam();
  }

  private subscribeToParam(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.orderId = +id;
          this.loadOrder();
        }
      });
  }

  private loadOrder(): void {
    this.orderService.getOrderById(this.orderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order: Order) => {
          this.order = order
          this.items = order.items
          this.loadCustomer();
        },
        error: () => {
          this.notification.error(
            'Failed to load order.'
          );
        }    
      });
  }

  private loadCustomer(): void {
    if (this.order.customerId)
      this.customerService
        .getCustomerById(this.order.customerId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: customer => {
            this.customer = customer;
          },
          error: () => {
            this.notification.error('Failed to load customer details.');
          }
        });
  }

  get grandTotal(): number {
    return this.items.reduce(
      (total, item) => total + (item.quantity * item.unitPrice),
      0
    );
  }

  goBack(): void {
    this.router.navigateByUrl(this.returnUrl);
  }

}