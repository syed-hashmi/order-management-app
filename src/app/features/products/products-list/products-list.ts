import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification-service';
import { ProductService } from '../services/product-service';
import { Product } from '../services/models/product.model';

@Component({
  selector: 'app-products-list',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSnackBarModule,
    ReactiveFormsModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {

  displayedColumns: string[] = [
    'name',
    'sku',
    'price',
    'stockQuantity',
    'actions'
  ];

  searchControl = new FormControl('', { nonNullable: true });
  dataSource = new MatTableDataSource<Product>([
  ]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 5;
  totalRecords = 0;

  constructor(private productService: ProductService,
    private destroyRef: DestroyRef,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.initializeSearch();
  }

  private loadProducts() {
    this.productService.getProducts(this.pageIndex + 1, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products: HttpResponse<Product[]>) => {
          this.updateProducts(products);
        },
        error: (error: HttpErrorResponse) => {
          this.notification.error(
            error.error?.message || 'Failed to load products. Please try again.');
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
          this.loadProducts();
          return;
        }

        this.searchProducts(searchTerm);

      });
  }

  private searchProducts(searchTerm: string) {
    this.productService
      .searchProductsByName(searchTerm, this.pageIndex + 1, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products: HttpResponse<Product[]>) => {
          this.updateProducts(products);
        },
        error: (error: HttpErrorResponse) => {
          this.notification.error(
            error.error?.message || 'Failed to search products.');
        }
      });
  }

  private updateProducts(response: HttpResponse<Product[]>): void {
    this.dataSource.data = response.body ?? [];
    this.totalRecords = Number(response.headers.get('X-Total-Count'));
  }


  deleteProduct(id: number) {
    this.productService.deleteProduct(id)
      .subscribe({
        next: (res: Product) => {
          this.notification.success('Product deleted successfully.');
          if (this.dataSource.data?.length == 1) {
            this.pageIndex--;
          }
          this.loadProducts();
        },
        error: (error: HttpErrorResponse) => {
          this.notification.error('Failed to delete product.');
        }
      });
  }


  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const search = this.searchControl.value.trim();
    if (search) {
      this.searchProducts(search);
    } else {
      this.loadProducts();
    }
  }
}
