import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Order } from './models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private readonly apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  getOrders(page?: number, pageSize?: number): Observable<HttpResponse<Order[]>> {
    if (page && pageSize) {
      const params = new HttpParams()
        .set('_page', page)
        .set('_limit', pageSize)
        .set('_sort', 'id')
        .set('_order', 'desc');

      return this.http.get<Order[]>(this.apiUrl, {
        params,
        observe: 'response'
      });
    } else {
      return this.http.get<Order[]>(this.apiUrl, {
        observe: 'response'
      });
    }
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<Order> {
    return this.http.delete<Order>(`${this.apiUrl}/${id}`);
  }

  searchOrders(
    searchTerm: string,
    page: number,
    pageSize: number
  ): Observable<HttpResponse<Order[]>> {

    const params = new HttpParams()
      .set('_page', page)
      .set('_limit', pageSize)
      .set('_sort', 'id')
      .set('_order', 'desc')
      .set('id_like', searchTerm);

    return this.http.get<Order[]>(this.apiUrl, {
      params,
      observe: 'response'
    });
  }

}