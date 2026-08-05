import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {


  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(page: number, pageSize: number): Observable<HttpResponse<Product[]>> {
    const params = new HttpParams()
      .set('_page', page)
      .set('_limit', pageSize)
      .set('_order', 'desc')
      .set('_sort', 'id');

    return this.http.get<Product[]>(this.apiUrl, { params, observe: 'response' });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }

  searchProductsByName(
    searchTerm: string,
    page: number,
    pageSize: number
  ): Observable<HttpResponse<Product[]>> {

    const params = new HttpParams()
      .set('_page', page)
      .set('_limit', pageSize)
      .set('_sort', 'id')
      .set('_order', 'desc')
      .set('name_like', searchTerm);

    return this.http.get<Product[]>(this.apiUrl, {
      params,
      observe: 'response'
    });
  }


}
