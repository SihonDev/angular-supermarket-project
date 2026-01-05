import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/OrdersService';
import { UsersService } from 'src/app/services/UsersService';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  constructor(
    private router: Router,
    private ordersService: OrdersService,
    public usersService: UsersService
  ) {}
  public fileUrl: string;
  public path: string;
  public url2: string = 'http://localhost:3001/';
  public filename = 'reciept3.txt';

  public urlDownload = 'assets/reciept3.txt';

  ngOnInit() {
    this.createReceipt();
  }

  public goBackToHomePage() {
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

  public getuserDetailsFromLocalStorage() {
    let userDetails = {
      email: sessionStorage.getItem('email'),
      token: sessionStorage.getItem('token'),
    };
    return userDetails
  }

  public createReceipt() {
    let userDetails = this.getuserDetailsFromLocalStorage;
    const observable = this.ordersService.createReceipt(userDetails);
    observable.subscribe((sucessFulServerResponse) => {
      this.urlDownload = 'assets/' + sucessFulServerResponse[0].reciept;
      this.filename = sucessFulServerResponse[0].reciept;
    });

    (serverErrorResponse) => {
      alert(
        'Error! Status: ' +
          serverErrorResponse.status +
          ', Message: ' +
          serverErrorResponse.error.error
      );
    };
  }
}
