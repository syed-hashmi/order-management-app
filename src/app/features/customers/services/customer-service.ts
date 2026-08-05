import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './models/customer.model';
import { environment } from '../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) { }

  getCustomers(page: number, pageSize: number): Observable<HttpResponse<Customer[]>> {
    const params = new HttpParams()
      .set('_page', page)
      .set('_limit', pageSize)
      .set('_order', 'desc')
      .set('_sort','id');

    return this.http.get<Customer[]>(this.apiUrl, { params, observe: 'response' });
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.apiUrl}/${id}`);
  }

  searchCustomersByName(
    searchTerm: string,
    page: number,
    pageSize: number
  ): Observable<HttpResponse<Customer[]>> {

    const params = new HttpParams()
      .set('_page', page)
      .set('_limit', pageSize)
      .set('_sort', 'id')
      .set('_order', 'desc')
      .set('fullName_like', searchTerm);

    return this.http.get<Customer[]>(this.apiUrl, {
      params,
      observe: 'response'
    });
  }

}