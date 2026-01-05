import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartsService } from 'src/app/services/CartsService';
import { OrdersService } from 'src/app/services/OrdersService';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.css']
})
export class CheckoutCartComponent implements OnInit {

  constructor(private router: Router, public cartsService: CartsService, public ordersService: OrdersService) { }

  @Input() getSearchedProduct

  public userType: string;
  public email: string;
  public token: string;
  public cartsArray: any = [];
  public userDetails: any;
  public productToRemove: any;
  public cartID: any;
  public userCartDetails: any;
  public searchedQueryString: string;
  public searchbarStringSentFromSearchbar

  ngOnInit() {
    this.getInfoFromLocalStorage();
    this.getAllProductsInCart();
  }

  public cartTotalPrice() {
    let totalPrice: any = 0;
    for (let i = 0; i < this.cartsArray.length; i++) {
      totalPrice = Number(totalPrice) + Number(this.cartsArray[i].total);
    }
    totalPrice = totalPrice.toFixed(2)
    return totalPrice;
  }

  public getInfoFromLocalStorage() {
    this.userType = sessionStorage.getItem('userType');
    this.email = sessionStorage.getItem('email');
    this.token = sessionStorage.getItem('token');
    this.userDetails = {
      userType: this.userType,
      email: this.email,
      token: this.token,
    };
  }

  public getAllProductsInCart() {
    const observable = this.cartsService.getUserCartItems(this.userDetails);
    observable.subscribe((cartsArray) => {
      this.cartsArray = cartsArray[0];
      this.userCartDetails = cartsArray[1];
    });
    (serverErrorResponse) => {
      alert('Error! Status: ' + serverErrorResponse.status +
        ', Message: ' + serverErrorResponse.error.error
      );
    };
  }
}
