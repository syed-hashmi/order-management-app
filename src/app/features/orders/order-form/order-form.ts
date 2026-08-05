import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../customers/services/models/customer.model';
import { Product } from '../../products/services/models/product.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OrderService } from '../services/order-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification-service';
import { CustomerService } from '../../customers/services/customer-service';
import { ProductService } from '../../products/services/product-service';
import { forkJoin } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderItemForm } from '../services/models/order.model';

@Component({
  selector: 'app-order-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
})
export class OrderForm implements OnInit {
  orderForm!: FormGroup;
  customers: Customer[] = [];
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private notification: NotificationService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) { }

  ngOnInit(): void {
    this.initOrderForm();
    this.loadLookupData();
    this.addItem();
  }

  private initOrderForm(): void {
    this.orderForm = this.fb.group({
      customer: ['', Validators.required],
      status: ['Pending', Validators.required],
      items: this.fb.array([])
    });
  }

  private loadLookupData(): void {
    forkJoin({
      customers: this.customerService.getCustomers(),
      products: this.productService.getProducts()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ customers, products }: { customers: HttpResponse<Customer[]>, products: HttpResponse<Product[]> }) => {
          this.customers = customers?.body ?? [];
          this.products = products?.body ?? [];
        },
        error: () => {
          this.notification.error(
            'Failed to load lookup data.'
          );
        }
      });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        product: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [0]
      })
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  productChanged(index: number): void {
    const product =
      this.items.at(index).get('product')?.value;

    // const product =
    //   this.products.find(p => p.id === productId);
    if (product) {
      this.items.at(index)
        .patchValue({
          unitPrice: product.price
        });
    }
  }


  createOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    if (this.items.length === 0) {
      this.notification.warning('Please add at least one product.');
      return;
    }

    if (this.items.controls.some(item => item.invalid)) {
      this.notification.warning('Please complete all order items.');
      return;
    }
    const { customer, items, ...formValue } = this.orderForm.getRawValue();

    const order = {
      ...formValue,
      items: items.map((item: OrderItemForm) => ({
        productId: item?.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      orderDate: new Date().toISOString().split('T')[0],
      customerName: this.orderForm.getRawValue().customer?.fullName,
      customerId: this.orderForm.getRawValue()?.customer?.id
    };

    this.orderService.createOrder(order)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notification.success('Order created successfully.');
          this.router.navigate(['/orders']);
        },
        error: () => {
          this.notification.error('Failed to create order.');
        }
      });
  }

  cancel() {
    this.router.navigate(['/orders']);
  }
}
