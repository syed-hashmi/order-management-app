import { Component, DestroyRef, OnInit } from '@angular/core';
import { ProductService } from '../services/product-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../services/models/product.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../shared/services/notification-service';

@Component({
  selector: 'app-product-details',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {

  productId: number | null = null;
  product: Product | null = null;


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private notification: NotificationService

  ) { }

  ngOnInit() {
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
            .subscribe(
              {
                next: (product: Product) => {
                  this.product = product;

                },
                error: () => {
                  this.notification.error('Failed to load product details.');
                }
              }
            );
        }
      });
  }
}
