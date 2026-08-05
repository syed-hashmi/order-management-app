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
  quantity: number;
  unitPrice: number;
}