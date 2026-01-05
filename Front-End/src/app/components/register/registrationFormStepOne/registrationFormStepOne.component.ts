import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UsersService } from 'src/app/services/UsersService';
import { RegistrationFormStepOneDetails } from 'src/app/models/RegistrationFormStepOneDetails';
import { SuccessfullUserRegistrationFormStepOneServerResponse } from '../../../models/SuccessfullUserRegistrationFormStepOneServerResponse';

@Component({
  selector: 'app-registrationFormStepOne',
  templateUrl: './registrationFormStepOne.component.html',
  styleUrls: ['./registrationFormStepOne.component.css'],
})

export class RegistrationFormStepOneComponent implements OnInit {
  public userRegistrationFormStepOneDetails: RegistrationFormStepOneDetails;
  public successfullUserRegistrationFormStepOneServerResponse: SuccessfullUserRegistrationFormStepOneServerResponse;
  public usersService: UsersService;
  public registrationForm: FormGroup;
  public id: FormControl;
  public email: FormControl;
  public password: FormControl;
  public passwordConfirmation: FormControl;
  public disableButton: boolean = false;

  constructor(usersService: UsersService, private router: Router) {
    this.userRegistrationFormStepOneDetails = new RegistrationFormStepOneDetails();
    this.usersService = usersService;
    this.successfullUserRegistrationFormStepOneServerResponse = new SuccessfullUserRegistrationFormStepOneServerResponse();
  }

  ngOnInit() {
    this.sendAndListenToRegistrationStepTwoDetailsFromUsersService();
    this.stepOneRegistrationValidation();
  }

  public stepOneRegistrationValidation() {
    this.id = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
    this.email = new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]);
    this.password = new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!_%+-]\w{4,10}$/)]);
    this.passwordConfirmation = new FormControl('', [Validators.required, this.checkIfPasswordIsEqual.bind(this)]);
    this.registrationForm = new FormGroup({
      id: this.id,
      email: this.email,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
    });
  }

  ///ask milton
  public checkIfPasswordIsEqual() {
    let userPasswordsIsEqual = true;
    if (this.password === undefined || this.passwordConfirmation === undefined || this.passwordConfirmation.value != this.password.value) {
      userPasswordsIsEqual = false;
    }
    let s = userPasswordsIsEqual ? null : {
      checkIfPasswordIsEqual: {
        isEqual: false,
      },
    };
    return s;
  }

  public continueToStepTwo(): void {
    this.getInputsValue();
    this.verifyIfIdOrEmailExists();
  }

  public getInputsValue(): void {
    this.userRegistrationFormStepOneDetails.id = this.id.value;
    this.userRegistrationFormStepOneDetails.email = this.email.value;
    this.userRegistrationFormStepOneDetails.password = this.password.value;
    this.userRegistrationFormStepOneDetails.passwordConfirmation = this.passwordConfirmation.value;
  }

  public verifyIfIdOrEmailExists() {
    const observable = this.usersService.verifyIfIdOrEmailExists(
      this.userRegistrationFormStepOneDetails
    );
    observable.subscribe(
      (successfullUserRegistrationFormStepOneServerResponse) => {
        this.successfullUserRegistrationFormStepOneServerResponse.userNotFound = true;
        if (successfullUserRegistrationFormStepOneServerResponse == true) {
          this.passStepOneValues(this.userRegistrationFormStepOneDetails);
        }
      },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }

  public passStepOneValues(userRegistrationFormStepOneDetails) {
    this.usersService.sharingRegistrationStepOneDetails(userRegistrationFormStepOneDetails);
    this.registrationForm.controls.id.disable();
    this.registrationForm.controls.email.disable();
    this.registrationForm.controls.password.disable();
    this.registrationForm.controls.passwordConfirmation.disable();
    this.disableButton = true;
  }

  public sendAndListenToRegistrationStepTwoDetailsFromUsersService() {
    this.usersService.registrationStepOneServerResponse.subscribe((message) => {
      if (this.registrationForm != undefined) {
        this.registrationForm.controls.id.enable();
        this.registrationForm.controls.email.enable();
        this.registrationForm.controls.password.enable();
        this.registrationForm.controls.passwordConfirmation.enable();
        this.disableButton = false;
      }
    });
  }

  public backToLoginPage(): void {
    this.router.navigateByUrl('');
  }
}
