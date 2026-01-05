import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetails } from '../models/ProductDetails';
import { SuccessfulResponseAddingProduct } from '../models/SuccessfulResponseAddingProduct';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  constructor(private http: HttpClient) { }

  public getUserStoreActivity(userDetails: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/carts/getUserStoreActivity`, userDetails);
  }

  public getUserCartItems(userDetails): Observable<any> {
    return this.http.post<ProductDetails[]>(`${environment.apiUrl}/carts/getUserCartItems`, userDetails);
  }

  public updateUserCartDetails(userDetails: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/carts/updateUserCartDetails`, userDetails);
  }

  public updateProductOnCartItems(productDetails): Observable<SuccessfulResponseAddingProduct> {
    return this.http.post<SuccessfulResponseAddingProduct>(`${environment.apiUrl}/carts/updateProductOnCartItems`, productDetails);
  }

  public removeProductFromCartItem(productCartInfo): Observable<SuccessfulResponseAddingProduct> {
    return this.http.post<SuccessfulResponseAddingProduct>(`${environment.apiUrl}/carts/removeProductFromCartItem`, productCartInfo);
  }

  public deleteMyCartFromDB(cartInfo): Observable<SuccessfulResponseAddingProduct> {
    return this.http.post<SuccessfulResponseAddingProduct>(`${environment.apiUrl}/carts/deleteMyCartFromDB`, cartInfo);
  }

  public addOrUpdateProductToCart(productDetails: any): Observable<SuccessfulResponseAddingProduct> {
    return this.http.post<SuccessfulResponseAddingProduct>(`${environment.apiUrl}/carts/addOrUpdateProductToCart`, productDetails);
  }

  public getItemFromServerToDisplay(item: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/carts/getItemFromServerToDisplay`, item);
  }
}
