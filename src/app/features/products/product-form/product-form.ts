import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification-service';
import { Customer } from '../../customers/services/models/customer.model';
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
import { ProductService } from '../services/product-service';
import { Product } from '../services/models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  productForm!: FormGroup;
  isEditMode!: boolean;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initForm();
    this.subscribeToParam();
  }

  subscribeToParam() {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');

      if (id) {
        this.productId = +id;
        this.productService.getProductById(+id)
          .subscribe(product => {
            this.isEditMode = true;
            this.productForm.patchValue(product);
          });
      }
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      sku: ['', [
        Validators.required,

      ]],
      price: ['', [
        Validators.required,
      ]],
      stockQuantity: ['', [
        Validators.required,
      ]],
      isActive: [true]
    });
  }


  get form() {
    return this.productForm.controls;
  }

  createProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = {
      ...this.productForm.getRawValue(),
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.productService.createProduct(product)
      .subscribe({
        next: (product: Product) => {
          debugger
          this.notification.success('Product added successfully.');
          this.reset();
          this.router.navigate(['/products']);
        },

        error: (error: HttpErrorResponse) => {
          this.notification.error('Failed to add product.');
        }
      });

  }


  updateProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = {
      id: this.productId,
      ...this.productForm.getRawValue(),
      createdDate: new Date().toISOString().split('T')[0],
    };

    this.productService.updateProduct(product)
      .subscribe({
        next: (product: Product) => {
          this.notification.success('Product updated successfully.');
          this.router.navigate(['/products']);
        },

        error: (error: HttpErrorResponse) => {
          this.notification.error('Failed to update product.');
        }
      });
  }

  reset(): void {
    this.productForm.reset({
      fullName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      isActive: true
    });
  }

  cancel(): void {
    this.reset();
    this.router.navigate(['/products']);
  }
}
