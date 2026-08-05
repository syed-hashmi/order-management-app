import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../services/customer-service';
import { Customer } from '../services/models/customer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) { }

  ngOnInit() {
    this.subscribeToParam();

  }

  subscribeToParam() {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');

      if (id) {
        this.customerId = +id;
        this.customerService.getCustomerById(+id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((customer: Customer) => {
            this.customer = customer

          });
      }
    });
  }
}
