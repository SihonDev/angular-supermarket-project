import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/UsersService';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})

export class ClientComponent implements OnInit {

  constructor(private router: Router, public usersService: UsersService) {
    this.usersService = usersService;
  }
  
  public searchedProduct:any;
  public displayProductChangingDetails:any;

  ngOnInit() {
    this.viewCart()
  }

  public hideCart() {
    $(".cart-section").hide();
    $(".product-section").css({"grid-column": "1 / 9"});
    $("#hideCart").hide();
    $("#viewCart").show();
 }

 public viewCart() {
   $(".cart-section").show();
   $(".product-section").css({"grid-column": "1 / 5"});
   $("#viewCart").hide();
   $("#hideCart").show();
 }

  public displayInputSearchedTextProduct(newItem) {
    this.searchedProduct = newItem;
  }

  public passProductChangingDetails(newItem) {
    this.displayProductChangingDetails = newItem;
  }
}
