import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor() {}
  public currentItem;
  public sharedProductDetails;
  public displayFoundProducts;

  ngOnInit() {}

  public sendMessageRecievedFromAdminCartItemToAdminLayoutComponent(newItem) {
    console.log(newItem);
    this.currentItem = newItem
  }

  public displayProductDetails(newItem) {
    console.log(newItem);
    this.sharedProductDetails = newItem;
  }

  public displayInputSearchedTextProduct(newItem) {
    console.log(newItem);
    this.displayFoundProducts = newItem;
  }

}
