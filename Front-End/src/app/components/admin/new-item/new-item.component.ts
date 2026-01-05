import { Component, OnInit, OnDestroy, SimpleChange } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/ProductsService';
import { CategoriesDetails } from '../../../models/CategoriesDetails';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  constructor(private productsService: ProductsService, private router: Router) { }

  public buttonTextAccordingAction = 'something';
  public openSection = true;
  public productName: string;
  public productId: number;
  public productPrice: number;
  public category: string;
  public showUploader: boolean = true;
  public categoriesObject = new CategoriesDetails();
  public listOfCategories: any[] = this.categoriesObject.categoriesDetails;
  public file: File;
  public fileName: string = 'No file selected';
  public upLoadedFile: boolean = false;
  public productToUpdate: any;
  public addProduct: boolean = false;
  public updateProduct: boolean = false;
  public submitButtonValue: string;
  public urlPath = 'http://localhost:3001/';
  public urlToShow: string | ArrayBuffer = '';
  public urlPathToShow: string | ArrayBuffer = '';

  @Output() displayUpdatedProduct = new EventEmitter<any>();
  @Input() displayProductToUpdateDetails;

  ngOnInit() {
    this.displayTextAccordingAction();
  }

  public displayTextAccordingAction() {
    this.openSection = !this.openSection;
    if (this.buttonTextAccordingAction == 'Add a product') {
      this.addProduct = true;
      this.updateProduct = false;
      this.buttonTextAccordingAction = 'Close section of adding a product';
    } else if (this.buttonTextAccordingAction == 'Update a product') {
      this.addProduct = false;
      this.updateProduct = true;
      this.buttonTextAccordingAction = 'Close section of updating a product';
    } else {
      this.addProduct = false;
      this.updateProduct = false;
      this.buttonTextAccordingAction = 'Add a product';
      this.updatingInputForm('', '', '', '', '', false, 'No file selected', null, 'Save');
    }
  }

  public updatingInputForm(productName, category, productId, productPrice, url,
    upLoadedFileBool, fileName, file, submitButtonValue) {
    this.productName = productName;
    this.category = category;
    this.productId = productId;
    this.productPrice = productPrice;
    this.urlToShow = url;
    this.upLoadedFile = upLoadedFileBool;
    this.fileName = fileName;
    this.file = file;
    this.submitButtonValue = submitButtonValue;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['displayProductToUpdateDetails'] &&
      changes['displayProductToUpdateDetails'].previousValue !=
      changes['displayProductToUpdateDetails'].currentValue
    ) {
      this.setProductToUpdate(
        this.displayProductToUpdateDetails
      );
      this.buttonTextAccordingAction = 'Close section of updating a product';
      this.openSection = true;
      this.addProduct = false;
      this.updateProduct = true;
    }
  }

  public setProductToUpdate(product) {
    this.productToUpdate = product;
    if (
      this.productToUpdate != undefined &&
      this.productToUpdate.length != 0
    ) {
      this.addProduct = false;
      this.updateProduct = true;
      this.urlToShow = this.urlPath + this.productToUpdate.pictureRoute;
      this.fileName = this.productToUpdate.pictureRoute;
      this.urlPathToShow = this.fileName;
      this.updatingInputForm(
        this.productToUpdate.productName,
        this.productToUpdate.categoryId,
        this.productToUpdate.id,
        this.productToUpdate.price,
        this.urlToShow,
        true,
        this.fileName,
        null,
        'Update'
      );
    }
  }

  public saveProductInDB() {
    if (this.inputsValidation()) {
      const myFormData = new FormData();
      console.log(myFormData)
      this.updateMyFormDataWithNewInputs(myFormData);
      this.showUploader = false;
      setTimeout(() => {
        this.showUploader = true;
      }, 1);
    }
  }

  public inputsValidation() {
    if (this.productName == undefined || this.productName == '') {
      alert('Product name must be not empty');
      return false;
    } else if (this.productPrice == undefined || this.productPrice <= 0) {
      alert('Product price must be not empty and above 0');
      return false;
    } else if (this.category == undefined || this.category == '') {
      alert('Please choose a category');
      return false;
    }
    return true;
  }

  public updateMyFormDataWithNewInputs(myFormData) {
    console.log(myFormData)
    let substring = this.urlPath;
    myFormData.append('productName', this.productName.toString());
    myFormData.append('productPrice', this.productPrice.toString());
    myFormData.append('category', this.category.toString());
    myFormData.append(
      'urlPath',
      this.urlToShow.toString().substring(substring.length)
    );

    if (this.file != undefined && this.file != null) {
      myFormData.append('file', this.file, this.fileName);
      myFormData.set('urlPath', '');
    }
    console.log(myFormData)
    this.AddOrUpdateMyFormDataAndSendToServer(myFormData);
  }

  public AddOrUpdateMyFormDataAndSendToServer(myFormData) {
    console.log(myFormData)
    if (this.addProduct == true && this.updateProduct == false) {
      if (this.file != undefined && this.file != null) {
        this.addProductInServer(myFormData);
        this.displayTextAccordingAction();
        alert('Product added');
      } else {
        alert('Please add a file');
      }
    } else if (
      this.addProduct == false &&
      this.updateProduct == true
    ) {
      myFormData.append('productId', this.productId.toString());
      this.updateProductInServer(myFormData);
      this.displayTextAccordingAction();
      alert('Product updated');
    }
  }

  public onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.upLoadedFile = true;
      this.fileName = event.target.files[0].name;
      this.file = event.target.files[0];
      console.log("i choose 1" + this.fileName)
      console.log("i choose 2" + this.file)
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.urlToShow = event.target.result;
      };
    }
    if (event.target.files[0] == undefined) {
      console.log("balagan")
      this.urlToShow = '';
      this.fileName = 'No file selected';
    }
  }

  public updateProductInServer(myFormData) {
    console.log(myFormData)
    const observable = this.productsService.updateProduct(myFormData);
    observable.subscribe(
      (successfulServerRequestData) => {
        this.displayUpdatedProduct.emit({
          ...successfulServerRequestData,
        });
      },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }

  public addProductInServer(myFormData) {
    const observable = this.productsService.addProduct(myFormData);
    console.log(myFormData)
    observable.subscribe(
      (successfulServerRequestData) => {
        this.displayUpdatedProduct.emit({
          ...successfulServerRequestData,
        });
      },
      (serverErrorResponse) => {
        alert('Error! Status: ' + serverErrorResponse.status +
          ', Message: ' + serverErrorResponse.error.error
        );
      }
    );
  }
}
