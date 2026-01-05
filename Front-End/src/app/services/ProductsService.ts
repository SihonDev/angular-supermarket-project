import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ProductDetails } from '../models/ProductDetails';
import { SuccessfulResponseAddingProduct } from '../models/SuccessfulResponseAddingProduct';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  public listOfCategoryID = new BehaviorSubject(0);
  productListOfGivenCategoryID = this.listOfCategoryID.asObservable();

  constructor(private http: HttpClient) { }

  public findProductCategoryID(productListOfGivenCategoryID: any) {
    this.listOfCategoryID.next(productListOfGivenCategoryID);
  }

  public getTheNumberOfProductsLeftInStock(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products/getTheNumberOfProductsLeftInStock`);
  }

  public getAllProducts(): Observable<ProductDetails[]> {
    return this.http.get<ProductDetails[]>(`${environment.apiUrl}/products/getAllProducts`);
  }

  public addProduct(productToAddForm: FormData): Observable<SuccessfulResponseAddingProduct> {
    return this.http.post<SuccessfulResponseAddingProduct>(`${environment.apiUrl}/products/addProduct`, productToAddForm);
  }

  public updateProduct(productToAddForm: FormData): Observable<SuccessfulResponseAddingProduct> {
    return this.http.post<SuccessfulResponseAddingProduct>(`${environment.apiUrl}/products/updateProduct`, productToAddForm);
  }

  public searchProduct(productName: any): Observable<any> {
    let productNameObject = { productName: productName };
    return this.http.post<any>(`${environment.apiUrl}/products/searchProduct`, productNameObject);
  }
}