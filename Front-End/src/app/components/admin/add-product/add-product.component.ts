import { Component, OnInit, Output, EventEmitter, Input, SimpleChange, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})

export class AddProductComponent implements OnInit {

  constructor() { }
  public productToUpdate: any;
  public currentProduct: any;
  public passProductToUpdateDetails;

  @Output() displayUpdatedProduct = new EventEmitter<any>();
  @Input() getProductToUpdate;

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['getProductToUpdate'] &&
      changes['getProductToUpdate'].previousValue !=
      changes['getProductToUpdate'].currentValue
    ) { if (
        this.getProductToUpdate != null &&
        this.getProductToUpdate != undefined
      ) {
        this.productToUpdate = this.getProductToUpdate;
        this.passProductToUpdateDetails = this.productToUpdate;
      }
    }
  }

  ngOnInit() { }

  public shareUpdatedProduct(newItem) {
    this.displayUpdatedProduct.emit(newItem);
  }
}
