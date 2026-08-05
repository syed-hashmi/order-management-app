import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomerService } from '../services/customer-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification-service';
import { Customer } from '../services/models/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
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
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerForm {
  customerForm!: FormGroup;
  isEditMode!: boolean;
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
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
        this.customerId = +id;
        this.customerService.getCustomerById(+id)
          .subscribe(customer => {
            this.isEditMode = true;
            this.customerForm.patchValue(customer);
          });
      }
    });
  }

  initForm() {
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


  get form() {
    return this.customerForm.controls;
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
      .subscribe({
        next: (customer: Customer) => {
          debugger
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

  reset(): void {
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
    this.reset();
    this.router.navigate(['/customers']);
  }
}
