import { Routes } from '@angular/router';
import { Layout } from './core/components/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./features/dashboard/dashboard')
                        .then(m => m.Dashboard)
            },
            {
                path: 'customers',
                loadComponent: () =>
                    import('./features/customers/customers-list/customers-list')
                        .then(m => m.CustomersList)
            },
            {
                path: 'customer/new',
                loadComponent: () =>
                    import('./features/customers/customer-form/customer-form')
                        .then(m => m.CustomerForm)
            },
            {
                path: 'customer/:id/view',
                loadComponent: () =>
                    import('./features/customers/customer-details/customer-details')
                        .then(m => m.CustomerDetails)
            },
            {
                path: 'customer/:id/edit',
                loadComponent: () =>
                    import('./features/customers/customer-form/customer-form')
                        .then(m => m.CustomerForm)
            },
            {
                path: 'products',
                loadComponent: () =>
                    import('./features/products/products-list/products-list')
                        .then(m => m.ProductsList)
            },

            {
                path: 'product/new',
                loadComponent: () =>
                    import('./features/products/product-form/product-form')
                        .then(m => m.ProductForm)
            },
            {
                path: 'product/:id/view',
                loadComponent: () =>
                    import('./features/products/product-details/product-details')
                        .then(m => m.ProductDetails)
            },
            {
                path: 'product/:id/edit',
                loadComponent: () =>
                    import('./features/products/product-form/product-form')
                        .then(m => m.ProductForm)
            },
            {
                path: 'orders',
                loadComponent: () =>
                    import('./features/orders/orders-list/orders-list')
                        .then(m => m.OrdersList)
            },
            {
                path: 'order/new',
                loadComponent: () =>
                    import('./features/orders/order-form/order-form')
                        .then(m => m.OrderForm)
            },
            {
                path: 'order/:id/view',
                loadComponent: () =>
                    import('./features/orders/order-details/order-details')
                        .then(m => m.OrderDetails)
            },
            {
                path: 'order/:id/edit',
                loadComponent: () =>
                    import('./features/orders/order-form/order-form')
                        .then(m => m.OrderForm)
            },

        ]
    }
];
