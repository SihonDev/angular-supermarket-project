import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CartsService } from '../../../../services/CartsService';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})

export class CartItemComponent implements OnInit {
  constructor(private router: Router, private cartsService: CartsService) { }

  @Input() item: any;
  @Output() productToRemove = new EventEmitter<any>();

  public url = 'http://localhost:3001/';
  public productQuantity: number = 0;

  ngOnInit() { }

  public removeProduct() {
    this.removeProductFromCartItem(this.item);
    this.removeProductFromCartItemOnUI(this.item);
  }

  public removeProductFromCartItemOnUI(item) {
    this.productToRemove.emit(this.item);
  }

  public increaseQuantity(item) {
    if (item.quantityForUpdate < 99) {
      item.quantityForUpdate = item.quantityForUpdate + 1;
      item.total = item.price * item.quantityForUpdate;
      item.total = item.total.toFixed(2);
      this.updateProductOnCartItems(item);
    }
    else { alert('You cant add more than 99 items for this product') }
  }

  public decreaseQuantity(item) {
    if (item.quantityForUpdate > 1) {
      item.quantityForUpdate = item.quantityForUpdate - 1;
      item.total = item.price * item.quantityForUpdate;
      item.total = item.total.toFixed(2);

      this.updateProductOnCartItems(item);
    }
  }

  public removeProductFromCartItem(productCartInfo) {
    const observable = this.cartsService.removeProductFromCartItem(productCartInfo);
    observable.subscribe(
      (successfulServerRequestData) => { },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error);
      }
    );
  }

  public updateProductOnCartItems(item) {
    const observable = this.cartsService.updateProductOnCartItems(item);
    observable.subscribe(
      (successfulServerRequestData) => { },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error);
      }
    );
  }
}
