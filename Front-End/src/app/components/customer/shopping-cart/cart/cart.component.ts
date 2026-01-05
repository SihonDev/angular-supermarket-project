import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { CartsService } from '../../../../services/CartsService';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})

export class CartComponent implements OnInit {
  constructor(private router: Router, public cartsService: CartsService) { }

  public userType: string;
  public email: string;
  public token: string;
  public cartsArray: any = [];
  public userDetails: any;
  public cartID: any;
  public userCartDetails: any;

  @Input() overwriteProductDetailsOnCartItem;

  ngOnInit() {
    this.getUserDetails();
    this.getAllProductsInCart();
  }

  public getUserDetails() {
    this.userType = sessionStorage.getItem('userType');
    this.email = sessionStorage.getItem('email');
    this.token = sessionStorage.getItem('token');
    this.userDetails = {
      userType: this.userType,
      email: this.email,
      token: this.token,
    };
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (
      changes['overwriteProductDetailsOnCartItem'] &&
      changes['overwriteProductDetailsOnCartItem'].previousValue !=
      changes['overwriteProductDetailsOnCartItem'].currentValue
    ) {
      this.getAllProductsInCart();
    }
  }

  public getAllProductsInCart() {
    const observable = this.cartsService.getUserCartItems(this.userDetails);
    observable.subscribe((cartsArray) => {
      this.cartsArray = [...cartsArray[0]];

      console.log(this.cartsArray);
      this.userCartDetails = cartsArray[1];
    });
    (serverErrorResponse) => {
      alert('Error! Status: ' + serverErrorResponse.status +
        ', Message: ' + serverErrorResponse.error.error);
    };
  }

  public cartTotalPrice() {
    let totalPrice: any = 0;
    for (let i = 0; i < this.cartsArray.length; i++) {
      totalPrice =
        Number(totalPrice) + Number(this.cartsArray[i].total);
    }
    totalPrice = Number(totalPrice).toFixed(2);
    return totalPrice;
  }

  public removeAnItemFromCart(item: any) {
    for (let i = 0; i < this.cartsArray.length; i++) {
      if (
        item.product_id == this.cartsArray[i].product_id &&
        item.cart_id == this.cartsArray[i].cart_id
      ) {
        this.cartsArray.splice(i, 1);
      }
    }
  }

  public deleteMyCart() {
    this.deleteMyCartFromUI();
    this.deleteMyCartFromDB();
  }

  public deleteMyCartFromUI() {
    if (this.cartsArray != undefined && this.cartsArray.length != 0) {
      this.cartID = {
        cart_id: this.cartsArray[0].cart_id,
      };
      this.cartsArray = [];
    } else {
    }
  }

  public deleteMyCartFromDB() {
    const observable = this.cartsService.deleteMyCartFromDB(this.cartID);
    observable.subscribe((shoppingCart) => { });
    (serverErrorResponse) => {
      alert('Error! Status: ' + serverErrorResponse.status +
        ', Message: ' + serverErrorResponse.error.error);
    };
  }

  public order(): void {
    this.router.navigate(['/checkout']);
  }

}
