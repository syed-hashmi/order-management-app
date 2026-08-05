import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification-service';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  isEditMode!: boolean;
  productId: number | null = null;
  product: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) { }

  ngOnInit() {
    this.initForm();
    this.subscribeToParam();
  }

  private subscribeToParam(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('id');

        if (id) {
          this.productId = +id;
          this.productService.getProductById(+id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(product => {
              this.product = product;
              this.isEditMode = true;
              this.productForm.patchValue(product);
            });
        }
      });
  }

  private initForm(): void {
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
        Validators.min(0)
      ]],
      stockQuantity: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      isActive: [true]
    });
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product: Product) => {
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
      createdDate: this.product?.createdDate
    };

    this.productService.updateProduct(product)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  private reset(): void {
    this.productForm.reset({
      name: '',
      sku: '',
      price: '',
      stockQuantity: '',
      isActive: true
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
