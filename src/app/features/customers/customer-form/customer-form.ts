import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification-service';
import { Customer } from '../services/models/customer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FORM_IMPORTS } from '../../../shared/imports/material-imports';

@Component({
  selector: 'app-customer-form',
  imports: [
   ...FORM_IMPORTS
  ],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerForm implements OnInit {
  customerForm!: FormGroup;
  isEditMode!: boolean;
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
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
        this.customerId = +id;
        this.customerService.getCustomerById(+id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(customer => {
            this.isEditMode = true;
            this.customerForm.patchValue(customer);
          });
      }
    });
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: ['', [
        Validators.pattern(/^[0-9+\-\s()]*$/)
      ]],
      dateOfBirth: [''],
      gender: [''],
      address: ['', [
        Validators.maxLength(250)
      ]],
      isActive: [true]
    });
  }

  createCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const customer = {
      ...this.customerForm.getRawValue(),
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.customerService.createCustomer(customer)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customer: Customer) => {
          this.notification.success('Customer added successfully.');
          this.reset();
          this.router.navigate(['/customers']);
        },

        error: (error: HttpErrorResponse) => {
          this.notification.error('Failed to add customer.');
        }
      });

  }


  updateCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const customer = {
      id: this.customerId,
      ...this.customerForm.getRawValue(),
      createdDate: new Date().toISOString().split('T')[0],
    };

    this.customerService.updateCustomer(customer)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customer: Customer) => {
          this.notification.success('Customer updated successfully.');
          this.router.navigate(['/customers']);
        },

        error: (error: HttpErrorResponse) => {
          this.notification.error('Failed to update customer.');
        }
      });
  }

  private reset(): void {
    this.customerForm.reset({
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
    this.router.navigate(['/customers']);
  }
}
