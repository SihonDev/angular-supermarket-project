import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/OrdersService';
import { ProductsService } from 'src/app/services/ProductsService';

@Component({
  selector: 'app-summery',
  templateUrl: './summery.component.html',
  styleUrls: ['./summery.component.css']
})
export class SummeryComponent implements OnInit {
  constructor(private router: Router, private productsService: ProductsService, private ordersService: OrdersService) {}

  public numberOfProductsLeftInStock: number = 0;
  public numberOfSubmittedOrders: number = 0;

  @Input() isLoggedIn: boolean =true;
  @Input() firstName: string;
  @Input() greetingTextAccordingToSession: boolean =false; 
  @Input() getCartNotifications: boolean =false; 
  @Input() getOrderNotifications: boolean =false; 
  @Input() lastDateOfShoppingCartValue: any; 
  @Input() totalPriceOfOpenedCartValue : any; 
  @Input() lastDateOfOrderValue: any; 

  ngOnInit() {
    this.getTheNumberOfProductsLeftInStock();
    this.getTheTotalNumberOfSubmittedOrders();
  }

  public getTheNumberOfProductsLeftInStock(): void {
    const observable = this.productsService.getTheNumberOfProductsLeftInStock();
    observable.subscribe(
      (successfulServerRequestData) => {
        this.numberOfProductsLeftInStock = successfulServerRequestData;
      },
      (serverErrorResponse) => {
        console.log(serverErrorResponse);
        alert('Error! Status: ' + serverErrorResponse.status +
            ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }

  public getTheTotalNumberOfSubmittedOrders(): void {
    const observable = this.ordersService.getTheTotalNumberOfSubmittedOrders();
    observable.subscribe(
      (successfulServerRequestData) => {
        this.numberOfSubmittedOrders = successfulServerRequestData;
      },
      (serverErrorResponse) => {
        console.log(serverErrorResponse);
        alert('Error! Status: ' + serverErrorResponse.status +
            ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }
}
