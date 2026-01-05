import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { CartsService } from 'src/app/services/CartsService';

@Component({
  selector: 'app-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.css']
})
export class CheckoutItemComponent implements OnInit {
  constructor(private router: Router, private cartsService: CartsService) { }

  @Input() item: any;
  @Input() inputStringFromMyCartLayoutOrder: any;

  public searchedProduct: boolean = false;
  public allProducts: boolean = true;
  public productQuantity: number = 0;
  public url = 'http://localhost:3001/';

  ngOnInit() {
    this.resetSearchedString();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (
      changes['inputStringFromMyCartLayoutOrder'] &&
      changes['inputStringFromMyCartLayoutOrder'].previousValue !=
      changes['inputStringFromMyCartLayoutOrder'].currentValue
    ) {
      this.resetSearchedString();
      this.highlightProuctName(this.inputStringFromMyCartLayoutOrder);
    }
  }

  public resetSearchedString() {
    let arrayOfElements = document.getElementsByClassName('productName');
    for (let i = 0; i < arrayOfElements.length; i++) {
      arrayOfElements[i].classList.remove('searchedItem');
    }
  }

  public highlightProuctName(inputSearchText) {
    console.log("hy")
    if (inputSearchText.trim() != '') {
      let arrayOfElements = document.getElementsByClassName('productName');
      let productNameInShoppingCart: string;
      let inputToSearch = inputSearchText.toLowerCase();
      for (let i = 0; i < arrayOfElements.length; i++) {
        productNameInShoppingCart = arrayOfElements[i].innerHTML.toLowerCase();
        if (productNameInShoppingCart.includes(inputToSearch)) {
          arrayOfElements[i].classList.add('searchedItem');
        }
      }
    } else {
      let arrayOfElements = document.getElementsByClassName('productName');
      let productNameInShoppingCart: string;
      for (let i = 0; i < arrayOfElements.length; i++) {
        productNameInShoppingCart = arrayOfElements[i].innerHTML.toLowerCase();
        arrayOfElements[i].classList.remove('searchedItem');
      }
    }
  }
}
