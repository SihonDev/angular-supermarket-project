import { Component, OnInit } from '@angular/core';
import { UserLoginDetails } from '../../../models/UserLoginDetails';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { CartsService } from 'src/app/services/CartsService';
import { UsersService } from 'src/app/services/UsersService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userLoginDetails: UserLoginDetails;
  public usersService: UsersService;
  public cartsService: CartsService;
  public userForm: FormGroup;
  public email: FormControl;
  public password: FormControl;
  public successfulServerRequestData: any;
  public isLoggedIn: boolean = true;;
  public firstName: string;
  public greetingTextAccordingToSession: string;
  public getCartNotifications: boolean = false;
  public getOrderNotifications: boolean = false;
  public greetingMessageForNewCustomer: boolean = false;
  public totalPriceOfOpenedCart: number = 0;
  public lastDateOfOrder: any;

  public lastDateOfShoppingCart: any = '01/01/2021';

  @Output() passDataToParentComponent = new EventEmitter<any>();

  constructor(usersService: UsersService, private router: Router, cartsService: CartsService) {
    this.userLoginDetails = new UserLoginDetails();
    this.usersService = usersService;
    this.cartsService = cartsService;
  }

  ngOnInit() {
    this.loginInputsValidation();
    this.getUserStoreActivity();
  }

  public loginInputsValidation() {
    this.email = new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
    this.password = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!_%+-]\w{4,10}$/)]);
    this.userForm = new FormGroup({ email: this.email, password: this.password });
  }

  public login(): void {
    this.userLoginDetails.email = this.email.value;
    this.userLoginDetails.password = this.password.value;
    const observable = this.usersService.login(this.userLoginDetails);
    observable.subscribe(
      (successfulServerRequestData) => {
        this.saveDataInSessionStorage(successfulServerRequestData);
        if (sessionStorage.getItem('userType') == 'Admin') {
          this.router.navigate(['/admin']);
        }
        this.getUserStoreActivity();
        this.userForm.reset();     
      },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }

  public saveDataInSessionStorage(ArrayInfo) {
    sessionStorage.setItem('email', ArrayInfo[0].email);
    sessionStorage.setItem('token', ArrayInfo[0].password);
    sessionStorage.setItem('firstName', ArrayInfo[0].firstName);
    sessionStorage.setItem('userType', ArrayInfo[0].userType);
    sessionStorage.setItem('isLoggedIn', 'true');
  }

  public getUserStoreActivity(): any {
    this.showUserStoreActivity(false, false, false);
    let dateOfShoppingCart = '01/01/1970';
    let lastDateOfShoppingCartInfo;
    let dateOfOrder;
    let userType = sessionStorage.getItem('userType');
    if (userType == 'Client') {
      let userDetails = {
        email: sessionStorage.getItem('email'),
        token: sessionStorage.getItem('token'),
      };
      if (userDetails.email != null && userDetails.token != null) {
        const observable = this.cartsService.getUserStoreActivity(userDetails);
        observable.subscribe(
          (successfulServerRequestData) => {
            if (successfulServerRequestData[0].length != 0 && successfulServerRequestData[1].length != 0) {
              lastDateOfShoppingCartInfo = successfulServerRequestData[0][0];
              this.showUserStoreActivity(true, true, true);
              dateOfShoppingCart = lastDateOfShoppingCartInfo.created_date;
              this.lastDateOfShoppingCart = moment(dateOfShoppingCart).format('DD-MM-YYYY');
              this.totalPriceOfOpenedCart = successfulServerRequestData[2];
              this.totalPriceOfOpenedCart = Number(this.totalPriceOfOpenedCart.toFixed(2));
              dateOfOrder = successfulServerRequestData[1][0].order_date;
              this.lastDateOfOrder = moment(dateOfOrder).format('DD-MM-YYYY');
              this.greetingTextAccordingToSession = 'Welcome back, Feel-good shopping';
            } else if (successfulServerRequestData[0].length != 0) {
              this.showUserStoreActivity(true, false, true);
              lastDateOfShoppingCartInfo = successfulServerRequestData[0][0];
              dateOfShoppingCart = lastDateOfShoppingCartInfo.created_date;
              this.lastDateOfShoppingCart = moment(dateOfShoppingCart).format('DD-MM-YYYY');
              this.totalPriceOfOpenedCart = successfulServerRequestData[2];
              this.greetingTextAccordingToSession = 'Welcome back, Feel-good shopping';
            } else {
              this.showUserStoreActivity(false, false, true);
              this.greetingTextAccordingToSession = 'Feel-good shopping';
            }
            this.dataToShareWithParentComponent(
              this.isLoggedIn,
              this.firstName,
              this.greetingTextAccordingToSession,
              this.getCartNotifications,
              this.getOrderNotifications,
              this.lastDateOfShoppingCart,
              this.totalPriceOfOpenedCart,
              this.lastDateOfOrder
            );
          },
          (serverErrorResponse) => {
            alert('Error! Status: ' + serverErrorResponse.status +
              ', Message: ' + serverErrorResponse.error.error
            );
          }
        );
      }
    }
  }

  public showUserStoreActivity(getCartNotifications, getOrderNotifications, greetingMessageForNewCustomer) {
      (this.getCartNotifications = getCartNotifications),
      (this.getOrderNotifications = getOrderNotifications),
      (this.greetingMessageForNewCustomer = greetingMessageForNewCustomer);
  }

  public dataToShareWithParentComponent(
    isLoggedIn: boolean,
    firstName: string = sessionStorage.getItem('firstName'),
    greetingTextAccordingToSession: string,
    getCartNotifications: boolean,
    getOrderNotifications: boolean,
    lastDateOfShoppingCart: any,
    totalPriceOfOpenedCart: any,
    lastDateOfOrder: any,
  ) {
    let values = [
      isLoggedIn,
      firstName,
      greetingTextAccordingToSession,
      getCartNotifications,
      getOrderNotifications,
      lastDateOfShoppingCart,
      totalPriceOfOpenedCart,
      lastDateOfOrder,
    ];
    this.passDataToParentComponent.emit(values);
  }

  public goToRegisterAnAccount(): void {
    this.router.navigateByUrl('/register');
  }
}