import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ListOfCities } from 'src/app/models/ListOfCitiesDetails';
import { ShippingDetails } from 'src/app/models/ShippingDetails';
import { SuccessfullUserRegistrationFormStepTwoServerResponse } from 'src/app/models/SuccessfullUserRegistrationFormStepTwoServerResponse';
import { OrdersService } from 'src/app/services/OrdersService';

@Component({
  selector: 'app-shipping-details',
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.css']
})
export class ShippingDetailsComponent implements OnInit {

  constructor(private router: Router, private ordersService: OrdersService) { }

  public shippingDetails = new ShippingDetails();
  public myCartDetails;
  public itemsOfCart;
  public successfullUserRegistrationFormStepTwoServerResponse = new SuccessfullUserRegistrationFormStepTwoServerResponse();
  public orderForm: FormGroup;
  public city: FormControl;
  public street: FormControl;
  public shippingDate: FormControl;
  public creditCard: FormControl;
  public listOfCitiesObject = new ListOfCities();
  public listOfCities;
  public touchTime = 0;
  public checkVisaCardBoolean: boolean = false;
  public checkMasterCardBoolean: boolean = false;
  public checkIsraCardBoolean: boolean = false;
  public checkAmericanExpressBoolean: boolean = false;
  public fileUrl: string;
  public path: string;
  public urlPath: string = 'http://localhost:3001/';
  public disableButton: boolean = false;

  invalidDates: Array<Date>;

  ngOnInit() {
    this.sameDateShipeDate();
    let today = new Date();
    let invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 2);
    this.invalidDates = [];
    this.listOfCities = this.listOfCitiesObject.listOfCities;
    this.shippingFormValidation();
  }

  public getuserDetailsFromLocalStorage() {
    let userDetails = {
      email: sessionStorage.getItem('email'),
      token: sessionStorage.getItem('token'),
    };
    return userDetails;
  }

  public shippingFormValidation() {
    this.city = new FormControl({ value: '', disabled: false }, [Validators.required]);
    this.street = new FormControl({ value: '', disabled: false }, [Validators.required]);
    this.shippingDate = new FormControl({ value: '', disabled: false }, [Validators.required]);
    this.creditCard = new FormControl({ value: '', disabled: false }, [Validators.required,
    this.checkCard([
      /^4[0-9]{12}(?:[0-9]{3})?$/,
      /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
      /(3640|4580)-?([0-9]{4}-?){3}/,
      /^3[47][0-9]{13}$/,
    ]),
    ]);
    this.orderForm = new FormGroup({
      city: this.city,
      street: this.street,
      shippingDate: this.shippingDate,
      creditCard: this.creditCard,
    });
  }

  public doubleClicked() {
    if (this.touchTime == 0) {
      this.touchTime = new Date().getTime();
    } else {
      if (new Date().getTime() - this.touchTime < 800) {
        this.touchTime = 0;
        return true;
      } else {
        this.touchTime = new Date().getTime();
        return false;
      }
    }
  }

  public getCityNameFromServer() {
    if (this.doubleClicked()) {
      const observable = this.ordersService.getCityNameFromServer('');
      observable.subscribe((successfulResponseFromServer) => {
        let cityID = this.getCityID(successfulResponseFromServer[0].city);
        this.city.setValue(cityID);
      },
        (serverErrorResponse) => {
          alert('Error! Status: ' + serverErrorResponse.status +
            ', Message: ' + serverErrorResponse.error.error
          );
        }
      );
    }
  }

  public getCityID(city) {
    for (let i = 0; i < this.listOfCities.length; i++) {
      if (this.listOfCities[i].name == city) {
        return this.listOfCities[i].id;
      }
    }
  }

  public getStreetNameFromServer() {
    if (this.doubleClicked()) {
      const observable = this.ordersService.getStreetNameFromServer(this.myCartDetails);
      observable.subscribe((successfulResponseFromServer) => {
        this.street.setValue(successfulResponseFromServer[0].street);
      },
        (serverErrorResponse) => {
          alert('Error! Status: ' + serverErrorResponse.status +
            ', Message: ' + serverErrorResponse.error.error
          );
        }
      );
    }
  }

  sameDateShipeDate() {
    const observable = this.ordersService.sameDateShipeDate();
    observable.subscribe(
      (successfulResponseFromServer) => {
        for (let i = 0; i < successfulResponseFromServer.length; i++) {
          this.invalidDates.push(
            new Date(successfulResponseFromServer[i])
          );
        }
        console.log(successfulResponseFromServer)
        console.log(this.invalidDates)
      },

      (serverErrorResponse) => {
        alert(
          'Error! Status: ' +
            serverErrorResponse.status +
            ', Message: ' +
            serverErrorResponse.error.error
        );
      }
    );
  }

  public getShipppingDate() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById("futureDate").setAttribute('min', today);
  }

  public checkCard(arrayNameRe: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const checkVisa = arrayNameRe[0].test(control.value);
      const checkMasterCard = arrayNameRe[1].test(control.value);
      const israCard = arrayNameRe[2].test(control.value);
      const americanExcpress = arrayNameRe[3].test(control.value);
      if (
        control.value !== undefined &&
        (isNaN(control.value) ||
          (checkVisa == false &&
            checkMasterCard == false &&
            israCard == false &&
            americanExcpress == false))
      ) {
        this.checkVisaCardBoolean = false;
        this.checkMasterCardBoolean = false;
        this.checkAmericanExpressBoolean = false;
        return { checkCard: false };
      }
      this.checkVisaCardBoolean = true;
      this.checkMasterCardBoolean = true;
      this.checkAmericanExpressBoolean = true;
      return null;
    };
  }

  public order(): void {
    this.shippingDetails.city = this.listOfCities[Number(this.city.value)].name;
    this.shippingDetails.street = this.street.value;
    this.shippingDetails.shippingDate = moment(this.shippingDate.value).format('YYYY-MM-DD');
    this.shippingDetails.creditCard = this.creditCard.value;
    let userDetails = this.getuserDetailsFromLocalStorage;
    let totalOrderDetails = [this.shippingDetails, this.myCartDetails, this.itemsOfCart, userDetails];
    this.insertOrderInServer(totalOrderDetails);
    this.router.navigateByUrl('/receipt');
  }

  public insertOrderInServer(totalOrderDetails) {
    const observable = this.ordersService.insertOrderInServer(totalOrderDetails);
    observable.subscribe(
      (successfullUserRegistrationFormStepTwoServerResponse) => {
        this.successfullUserRegistrationFormStepTwoServerResponse.userRegistered = true;
        if (successfullUserRegistrationFormStepTwoServerResponse !== true) {
        }
      },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }
}

