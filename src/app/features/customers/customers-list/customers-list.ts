import { Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer-service';
import { Customer } from '../services/models/customer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification-service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,

    MatFormFieldModule,
    MatInputModule,

    MatButtonModule,
    MatIconModule,

    RouterLink,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.scss'
})
export class CustomersList implements OnInit {

  displayedColumns: string[] = [
    'fullName',
    'email',
    'createdDate',
    'actions'
  ];

  searchControl = new FormControl('', { nonNullable: true });
  dataSource = new MatTableDataSource<Customer>([
  ]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 5;
  totalRecords = 0;

  constructor(private customerService: CustomerService,
    private destroyRef: DestroyRef,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.loadCustomers();
    this.initializeSearch();
  }

  private loadCustomers() {
    this.customerService.getCustomers(this.pageIndex + 1, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customers: HttpResponse<Customer[]>) => {
          this.updateCustomers(customers);
        },
        error: (error: HttpErrorResponse) => {
          this.notification.error(
            error.error?.message || 'Failed to load customers. Please try again.');
        }
      })
  }

  private initializeSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm: string) => {
        this.pageIndex = 0;
        this.paginator?.firstPage();
        if (!searchTerm.trim()) {
          this.loadCustomers();
          return;
        }

        this.searchCustomers(searchTerm);

      });
  }

  private searchCustomers(searchTerm: string) {
    this.customerService
      .searchCustomersByName(searchTerm, this.pageIndex + 1, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customers: HttpResponse<Customer[]>) => {
          this.updateCustomers(customers);
        },
        error: (error: HttpErrorResponse) => {
          this.notification.error(
            error.error?.message || 'Failed to search customers.');
        }
      });
  }

  private updateCustomers(response: HttpResponse<Customer[]>): void {
    this.dataSource.data = response.body ?? [];
    this.totalRecords = Number(response.headers.get('X-Total-Count'));
  }

  viewCustomer(id: number) {
    console.log('View', id);
  }

  deleteCustomer(id: number) {
    this.customerService.deleteCustomer(id)
      .subscribe({
        next: (res: Customer) => {
          this.notification.success('Customer deleted successfully.');
          if (this.dataSource.data?.length == 1){
            this.pageIndex--;
          }
          this.loadCustomers();
        },
        error: (error: HttpErrorResponse) => {
          this.notification.error('Failed to delete customer.');
        }
      });
  }


  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const search = this.searchControl.value.trim();
    if (search) {
      this.searchCustomers(search);
    } else {
      this.loadCustomers();
    }
  }
}