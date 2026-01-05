import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isLoggedIn: boolean;
  public firstName: string
  public greetingTextAccordingToSession: string
  public getCartNotifications: boolean;
  public getOrderNotifications: boolean;
  public lastDateOfShoppingCartValue: any;
  public totalPriceOfOpenedCartValue: any
  public lastDateOfOrderValue: any

  constructor(private router: Router) { }

  ngOnInit() {}

  shareDataWithSiblings(message: any) {
    this.isLoggedIn = message[0]
    this.firstName = message[1]
    this.greetingTextAccordingToSession = message[2]
    this.getCartNotifications = message[3]
    this.getOrderNotifications = message[4]
    this.lastDateOfShoppingCartValue = message[5]
    this.totalPriceOfOpenedCartValue  = message[6]
    this.lastDateOfOrderValue = message[7]
  }

  sendLogoutMesageToChild(message: any) {
    this.isLoggedIn = message[0]
    this.firstName = message[1]
    this.greetingTextAccordingToSession = message[2]
    this.getCartNotifications = message[3]
    this.getOrderNotifications = message[4]
    this.lastDateOfShoppingCartValue = message[5]
    this.totalPriceOfOpenedCartValue  = message[6]
    this.lastDateOfOrderValue = message[7]
  }
}
