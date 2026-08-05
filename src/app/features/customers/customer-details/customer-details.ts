import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer-service';
import { Customer } from '../services/models/customer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../shared/services/notification-service';

@Component({
  selector: 'app-customer-details',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.scss',
})
export class CustomerDetails implements OnInit {

  customerId: number | null = null;
  customer: Customer | null = null;


  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.subscribeToParam();

  }

  private subscribeToParam(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: ParamMap) => {
        const id = params.get('id');

        if (id) {
          this.customerId = +id;
          this.customerService.getCustomerById(+id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe
            ({
              next: (customer: Customer) => {
                this.customer = customer;
              },
              error: () => {
                this.notification.error('Failed to load customer details.')
              }
            })
        }
      });
  }
}
