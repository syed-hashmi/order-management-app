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
* View a list of recent orders.

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
* Navigate back from the order list page from details and create order pages


### Optimizations Used

(Added debounce time to efficiently manage api calls and search results)
(Use distinctUntilChanged to prevent duplicate API calls)
(used Lazy Loading routes for features when needed)