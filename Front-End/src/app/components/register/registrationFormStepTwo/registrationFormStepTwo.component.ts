import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationDetails } from 'src/app/models/RegistrationDetails';
import { RegistrationFormStepOneDetails } from 'src/app/models/RegistrationFormStepOneDetails';
import { RegistrationFormStepTwoDetails } from 'src/app/models/RegistrationFormStepTwoDetails';
import { SuccessfullUserRegistrationFormStepTwoServerResponse } from 'src/app/models/SuccessfullUserRegistrationFormStepTwoServerResponse';
import { UsersService } from 'src/app/services/UsersService';
import { ListOfCities } from 'src/app/models/ListOfCitiesDetails';

@Component({
  selector: 'app-registrationFormStepTwo',
  templateUrl: './registrationFormStepTwo.component.html',
  styleUrls: ['./registrationFormStepTwo.component.css'],
})
export class RegistrationFormStepTwoComponent implements OnInit {
  constructor(private router: Router, private usersService: UsersService) { }
  public userRegistrationFormStepOneDetails = new RegistrationFormStepOneDetails();
  public userRegistrationFormStepTwoDetails: RegistrationFormStepTwoDetails;
  public registrationDetails = new RegistrationDetails();
  public successfullUserRegistrationFormStepTwoServerResponse = new SuccessfullUserRegistrationFormStepTwoServerResponse();
  public registrationForm: FormGroup;
  public city: FormControl;
  public street: FormControl;
  public firstName: FormControl;
  public lastName: FormControl;
  public listOfCitiesObject = new ListOfCities();
  public listOfCities;
  public disableButton: boolean = true;

  ngOnInit() {
    this.subscribeToStepOne();
    this.stepTwoRegistrationValidation();
    this.listOfCities = this.listOfCitiesObject.listOfCities;
  }

  public subscribeToStepOne() {
    this.usersService.registrationStepOneServerResponse.subscribe((message) => {
      this.registrationDetails.id = String(message.id);
      this.registrationDetails.email = String(message.email);
      this.registrationDetails.password = String(message.password);
      if (this.registrationForm != undefined) {
        this.registrationForm.controls.city.enable();
        this.registrationForm.controls.street.enable();
        this.registrationForm.controls.firstName.enable();
        this.registrationForm.controls.lastName.enable();
        this.disableButton = false;
      }
    });
  }

  public stepTwoRegistrationValidation() {
    this.city = new FormControl({ value: '', disabled: true }, [Validators.required]);
    this.street = new FormControl({ value: '', disabled: true }, [Validators.required]);
    this.firstName = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]);
    this.lastName = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]);
    this.registrationForm = new FormGroup({
      city: this.city,
      street: this.street,
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }

  public getInputsValue(): void {
    this.registrationDetails.city = this.listOfCities[Number(this.city.value)].name;
    this.registrationDetails.street = this.street.value;
    this.registrationDetails.firstName = this.firstName.value;
    this.registrationDetails.lastName = this.lastName.value;
  }

  public register(): void {
    this.getInputsValue();
    const observable = this.usersService.register(this.registrationDetails);
    observable.subscribe(
      (successfullUserRegistrationFormStepTwoServerResponse) => {
        console.log(successfullUserRegistrationFormStepTwoServerResponse);
        this.successfullUserRegistrationFormStepTwoServerResponse.userRegistered = true;
        if (successfullUserRegistrationFormStepTwoServerResponse[1] == true) {
        } else {
          sessionStorage.setItem('email', successfullUserRegistrationFormStepTwoServerResponse[0].email);
          sessionStorage.setItem('token', successfullUserRegistrationFormStepTwoServerResponse[0].password);
          sessionStorage.setItem('firstName', successfullUserRegistrationFormStepTwoServerResponse[0].firstName);
          sessionStorage.setItem('userType', successfullUserRegistrationFormStepTwoServerResponse[0].userType);
          sessionStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['']);
        }
      },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }

  public goBackToStepOne() {
    this.usersService.sharingRegistrationStepOneDetails(false);
    this.registrationForm.controls.city.disable();
    this.registrationForm.controls.street.disable();
    this.registrationForm.controls.firstName.disable();
    this.registrationForm.controls.lastName.disable();
    this.disableButton = true;
  }
}
