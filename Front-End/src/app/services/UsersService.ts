import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { RegistrationFormStepOneDetails } from '../models/RegistrationFormStepOneDetails';
import { SuccessfulLoginServerResponse } from '../models/SuccessfulLoginServerResponse';
import { SuccessfullUserRegistrationFormStepOneServerResponse } from '../models/SuccessfullUserRegistrationFormStepOneServerResponse';
import { SuccessfullUserRegistrationFormStepTwoServerResponse } from '../models/SuccessfullUserRegistrationFormStepTwoServerResponse';
import { RegistrationFormStepTwoDetails } from '../models/RegistrationFormStepTwoDetails';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public registrationStepOneServerResponseDetails = new BehaviorSubject(RegistrationFormStepOneDetails);
  registrationStepOneServerResponse = this.registrationStepOneServerResponseDetails.asObservable();

  constructor(private http: HttpClient) { }

  public sharingRegistrationStepOneDetails(registrationStepOneServerResponse: any) {
    this.registrationStepOneServerResponseDetails.next(registrationStepOneServerResponse);
  }

  public verifyIfIdOrEmailExists(userRegistrationFormStepOneDetails: RegistrationFormStepOneDetails): Observable<SuccessfullUserRegistrationFormStepOneServerResponse> {
    return this.http.post<SuccessfullUserRegistrationFormStepOneServerResponse>(`${environment.apiUrl}/users/verifyIfIdOrEmailExists`, userRegistrationFormStepOneDetails);
  }

  public register(userRegistrationFormStepTwoDetails: RegistrationFormStepTwoDetails): Observable<SuccessfullUserRegistrationFormStepTwoServerResponse> {
    return this.http.post<SuccessfullUserRegistrationFormStepTwoServerResponse>(`${environment.apiUrl}/users/register`, userRegistrationFormStepTwoDetails);
  }

  public login(userLoginDetails: UserLoginDetails): Observable<SuccessfulLoginServerResponse> {
    return this.http.post<SuccessfulLoginServerResponse>(`${environment.apiUrl}/users/login`, userLoginDetails);
  }
}
