## Run the Project

1. Install the project dependencies:
npm install

2. Open **two separate terminal windows** and run the following commands:

**Terminal 1**
npm run start

**Terminal 2**
npm run api

Starts the backend/API service.


## Features

### Dashboard

* View total customers, total products, and total orders.
* View a list of recent orders. (Reused orders list component)

### Customers

* View customers with pagination.
* Search customers by Name.  (Added debouncetime to efficiently manage api calls and search results) (Use distinctUntilChanged to prevent duplicate API calls.)
* Add a new customer.
* Edit customer details.
* Delete a customer.

### Products

* View products with pagination.
* Search products by Name. (Added debouncetime to efficiently manage api calls and search results)(Use distinctUntilChanged to prevent duplicate API calls.)
* Add a new product.
* Edit product details.
* Delete a product.

### Orders

* View orders with pagination.
* Search orders by Order No.  (Added debounce time to efficiently manage api calls and search results)(Use distinctUntilChanged to prevent duplicate API calls.)
* Create a new order.
* View order details.
* Delete order
* checkbox will update order status to completed or pending
* Navigate back from the order list page from details and create order pages


### Technologies Used
* Angular 20
* Angular Material controls
* SCSS 

### Optimizations Used
(Automatic subscription cleanup using takeUntilDestroyed() to prevent memory leaks)
(Added debounce time to efficiently manage api calls and search results)
(Use distinctUntilChanged to prevent duplicate API calls)
(used Lazy Loading routes to reduce initial bundle size and improve application performance)
(creted shared material imports constant for all form components- similarly we can create it for all list components in application)
(created common notification service to avoid repeatation of snackbar code in all components)
(Parallel lookup API loading using forkJoin() where appropriate (e.g., loading customers and products simultaneously for the order form).)

