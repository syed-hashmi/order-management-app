import { Product } from "../../../products/services/models/product.model";

export interface Order {
  id: number;
  customerId: number;
  customerName: number;
  orderDate: string;
  status: 'Pending' | 'Completed';
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  productName:string;
  quantity: number;
  unitPrice: number;
}

export interface OrderItemForm {
  product: Product;
  quantity: number;
  unitPrice: number;
}