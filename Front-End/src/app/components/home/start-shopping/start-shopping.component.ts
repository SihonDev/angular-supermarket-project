import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartsService } from 'src/app/services/CartsService';

@Component({
  selector: 'app-start-shopping',
  templateUrl: './start-shopping.component.html',
  styleUrls: ['./start-shopping.component.css']
})
export class StartShoppingComponent implements OnInit {
  public cartsService: CartsService;
  public firstName: string;

  @Input() greetingTextAccordingToSession: string

  constructor(cartsService: CartsService, private router: Router) {
    this.cartsService = cartsService;
  }

  ngOnInit() {}

  public loginBasedUserType() {
    if (sessionStorage.getItem('userType') == 'Client') {
      this.updateUserCartDetails();
      this.router.navigate(['/shop']);
    }
    else if (sessionStorage.getItem('userType') == 'Admin') {
      this.router.navigate(['/admin']);
    }
  }

  public updateUserCartDetails() {
    const observable = this.cartsService.updateUserCartDetails({
      email: sessionStorage.getItem('email'),
    });
    observable.subscribe(
      (successfulServerRequestData) => {
      },
      (serverErrorResponse) => {
        console.log(serverErrorResponse);
        alert(
          'Error! Status: ' +
          serverErrorResponse.status +
          ', Message: ' +
          serverErrorResponse.error.error
        );
      }
    );
  }
}
