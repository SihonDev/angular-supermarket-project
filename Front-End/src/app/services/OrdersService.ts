import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccessfullUserRegistrationFormStepTwoServerResponse } from '../models/SuccessfullUserRegistrationFormStepTwoServerResponse';
import { ShippingDetails } from '../models/ShippingDetails';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  public getTheTotalNumberOfSubmittedOrders(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/orders/getTheTotalNumberOfSubmittedOrders`);
  }

  public getCityNameFromServer(myCartDetails: any): Observable<SuccessfullUserRegistrationFormStepTwoServerResponse> {
    return this.http.post<SuccessfullUserRegistrationFormStepTwoServerResponse>(`${environment.apiUrl}/orders/getCityNameFromServer`, myCartDetails);
  }

  public getStreetNameFromServer(myCartDetails: any): Observable<SuccessfullUserRegistrationFormStepTwoServerResponse> {
    return this.http.post<SuccessfullUserRegistrationFormStepTwoServerResponse>(`${environment.apiUrl}/orders/getStreetNameFromServer`, myCartDetails);
  }

  public sameDateShipeDate(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/orders/sameDateShipeDate`);
  }

  public insertOrderInServer(shippingDetails: ShippingDetails): Observable<SuccessfullUserRegistrationFormStepTwoServerResponse> {
    return this.http.post<SuccessfullUserRegistrationFormStepTwoServerResponse>(`${environment.apiUrl}/orders/insertOrderInServer`, shippingDetails);
  }

  public createReceipt(orderDetails: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/orders/createReceipt`, orderDetails);
  }
}