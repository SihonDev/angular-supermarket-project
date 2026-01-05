import { Component, OnInit, Output, EventEmitter, Input, SimpleChange, } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetails } from 'src/app/models/ProductDetails';
import { CartsService } from 'src/app/services/CartsService';
import { ProductsService } from 'src/app/services/ProductsService';
import { CategoriesDetails } from 'src/app/models/CategoriesDetails';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {

  public userType: string;
  public email: string;
  public token: string;
  public idOfCategory: number;
  public productsArray: ProductDetails[];
  public categoriesObject = new CategoriesDetails();
  public itemImfo: any;
  public displayProductDetailsOnModal = {
    pictureRoute: '',
    productName: '',
    price: '',
  };
  public userDetails: any;
  public showPicAfterClick: boolean = false;
  public productQuantity: number = 0;
  public cartDetails: any;
  public url: string = 'http://localhost:3001/';
  public customModalTextButton: string = 'Add';
  public showUploader = true;
  public currentCategoryID: number;
  public modalId: string = "productModal";

  @Output() passAddedOrUpdatedProductDetails = new EventEmitter<any>();
  @Output() shareProductDetails = new EventEmitter<any>();
  @Input() productListByCategory = [];
  @Input() getAddedOrUpdatedProductDetailsByAdmin;

  constructor(public productsService: ProductsService, public cartsService: CartsService, private router: Router) { }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['getAddedOrUpdatedProductDetailsByAdmin']
      && changes['getAddedOrUpdatedProductDetailsByAdmin'].previousValue
      != changes['getAddedOrUpdatedProductDetailsByAdmin'].currentValue) {
      this.getProducts();
    }
  }

  ngOnInit() {
    this.email = sessionStorage.getItem('email');
    this.token = sessionStorage.getItem('token');
    this.userType = sessionStorage.getItem('userType');
    this.userDetails = {
      userType: this.userType,
      email: this.email,
      token: this.token,
    };
    this.getProducts();
    this.getCartItems();
  }

  public getProducts() {
    this.productsService.productListOfGivenCategoryID.subscribe((message) => {
      this.currentCategoryID = message;
      if (message >= 1 && message <= 4) {
        const observable = this.productsService.getAllProducts();
        observable.subscribe((productsArray) => {
          this.productsArray = productsArray;
          let categoryID = message;
          let filteredProductsByCategory = this.filterProductsArray(
            this.productsArray,
            categoryID
          );
          this.productListByCategory = filteredProductsByCategory;
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
    });
  }

  public filterProductsArray(productsArray, id) {
    let filteredArray = productsArray.filter(function (product) {
      return product.categoryId == id;
    });
    return filteredArray;
  }

  public getCartItems() {
    const observable = this.cartsService.getUserCartItems(this.userDetails);
    observable.subscribe((cartsArray) => {
      this.cartDetails = cartsArray[1];
    });
    (serverErrorResponse) => {
      alert('Error! Status: ' + serverErrorResponse.status +
        ', Message: ' + serverErrorResponse.error.error);
    };
  }

  public passProductDetails(item) {
    if (this.userType == 'Admin') {
      this.preventModalOpening()
      this.shareProductDetails.emit({ ...item });
    } else {
      this.showPicAfterClick = true;
      this.getItemFromServerToDisplay(item);
      this.displayProductDetailsOnModal = item;
    }
  }

  public preventModalOpening(){
    $('#productModal').on('show.bs.modal', function (e) {
      return e.preventDefault(); 
     });
  }

  public getItemFromServerToDisplay(item) {
    const observable = this.cartsService.getItemFromServerToDisplay(item);
    observable.subscribe((ProductDetailsFromServer) => {
      if (ProductDetailsFromServer.length != 0) {
        this.productQuantity = ProductDetailsFromServer[0].quantity;
        this.customModalTextButton = 'Update';
      } else {
        this.productQuantity = 0;
        this.customModalTextButton = 'Add';
      }
    });
    (serverErrorResponse) => {
      alert('Error! Status: ' + serverErrorResponse.status +
        ', Message: ' + serverErrorResponse.error.error);
    };
  }

  public addOrUpdateProductQuantityOnCart(): void {
    if (this.productQuantity > 0 && this.productQuantity < 100) {
      let productDetails = [
        this.displayProductDetailsOnModal,
        { productQuantity: this.productQuantity },
        this.userDetails,
      ];
      this.addOrUpdateProductToCart(productDetails);
      this.passAddedOrUpdatedProductDetails.emit(productDetails);
    } else {
      alert("Please select product quantity between 1 to 99");
    }
  }

  public addOrUpdateProductToCart(productDetails): void {
    const observable = this.cartsService.addOrUpdateProductToCart([
      productDetails,
      this.cartDetails,
    ]);
    observable.subscribe((productDetails) => { });
    (serverErrorResponse) => {
      alert('Error! Status: ' + serverErrorResponse.status +
        ', Message: ' + serverErrorResponse.error.error);
    };
  }

  public increaseQuantity(): void {
    this.productQuantity = this.productQuantity + 1;
  }

  public decreaseQuantity(): void {
    if (this.productQuantity > 0) {
      this.productQuantity = this.productQuantity - 1;
    }
  }
}
