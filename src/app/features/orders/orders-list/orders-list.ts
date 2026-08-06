import { Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Router, RouterLink } from '@angular/router';

import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';



import { NotificationService } from '../../../shared/services/notification-service';
import { OrderService } from '../services/order-service';
import { Order } from '../services/models/order.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    MatCheckboxModule
  ],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss'
})
export class OrdersList implements OnInit {

  @Input()
  showRecent = false;

  displayedColumns: string[] = [
    'id',
    'customerName',
    'orderDate',
    'items',
    'status',
    'completed',
    'actions'
  ];

  searchControl = new FormControl('', { nonNullable: true });

  dataSource = new MatTableDataSource<Order>();

  pageIndex = 0;
  pageSize = 5;
  totalRecords = 0;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private orderService: OrderService,
    private notification: NotificationService,
    private destroyRef: DestroyRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.initializeSearch();
  }

  private loadOrders(): void {
    this.orderService.getOrders(this.pageIndex + 1, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: HttpResponse<Order[]>) => {
          this.updateOrders(response)
        },
        error: (err: HttpErrorResponse) => {
          this.notification.error(
            'Failed to load orders.'
          );
        }
      });
  }



  private initializeSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(searchTerm => {
        this.pageIndex = 0;
        this.paginator?.firstPage();

        if (!searchTerm.trim()) {
          this.loadOrders();
          return;
        }
        this.searchOrders(searchTerm);

      });
  }


  private searchOrders(searchTerm: string): void {
    this.orderService
      .searchOrders(searchTerm,
        this.pageIndex + 1,
        this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: HttpResponse<Order[]>) => {
          this.updateOrders(response);
        },
        error: () => {
          this.notification.error(
            'Failed to search orders.'
          );
        }
      });
  }
  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    const search = this.searchControl.value.trim();
    if (search) {
      this.searchOrders(search);
    } else {
      this.loadOrders();
    }
  }

  viewDetails(id: number): void {
    this.router.navigate(['/order', id, 'view'], {
      queryParams: {
        returnUrl: this.showRecent ? '/' : '/orders'
      }
    });
  }

  private updateOrders(response: HttpResponse<Order[]>): void {
    this.dataSource.data = response.body ?? [];
    this.totalRecords = Number(response.headers.get('X-Total-Count') ?? 0);
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrder(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: Order) => {
          this.notification.success('Order deleted successfully.');
          if (this.dataSource.data?.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.loadOrders();
        },
        error: (error: HttpErrorResponse) => {
          this.notification.error('Failed to delete order.');
        }
      });
  }


  toggleCompleted(order: Order, completed: boolean): void {
  const updatedOrder :Order= {
    ...order,
    status: completed ? 'Completed' : 'Pending'
  };

  this.orderService.updateOrder(updatedOrder)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.loadOrders();
        this.notification.success('Order status updated.');
      },
      error: () => {
        this.notification.error('Failed to update order status.');
      }
    });
}

}