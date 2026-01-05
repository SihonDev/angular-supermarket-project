import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA,ChangeDetectorRef } from '@angular/core';

import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { LayoutComponent } from '../components/layout/layout.component';
import { LoginComponent } from '../components/home/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoutingModule } from './routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersService } from '../services/UsersService';
import { AuthenticationInterceptor } from '../interceptors/AuthenticationInterceptor';
import { ClientComponent } from '../components/customer/client/client.component';
import { AdminComponent } from '../components/admin/admin.component';
import { CartComponent } from '../components/customer/shopping-cart/cart/cart.component';
import { AboutComponent } from '../components/home/about/about.component';
import { SummeryComponent } from '../components/home/summery/summery.component';
import { HomeComponent } from '../components/home/home.component';
import { ProductsComponent } from '../components/store-items/products/products.component';
import { MenuComponent } from '../components/menu/menu.component';
import { BannerComponent } from '../components/home/banner/banner.component';
import { RegisterComponent } from '../components/register/register.component';
import { CheckoutComponent } from '../components/checkout-orders/checkout/checkout.component';
import { StartShoppingComponent } from '../components/home/start-shopping/start-shopping.component';
import { CartsService } from '../services/CartsService';
import { CartItemComponent } from '../components/customer/shopping-cart/cart-item/cart-item.component';
import { ProductItemComponent } from '../components/store-items/product-item/product-item.component';
import { ProductsService } from '../services/ProductsService';
import { SearchComponent } from '../components/menu/search/search.component';
import { AddProductComponent } from '../components/admin/add-product/add-product.component';
import { NewItemComponent } from '../components/admin/new-item/new-item.component';
import { ShippingDetailsComponent } from '../components/checkout-orders/shipping-details/shipping-details.component';
import { CheckoutCartComponent } from '../components/checkout-orders/checkout-cart/checkout-cart.component';
import { CheckoutItemComponent } from '../components/checkout-orders/checkout-cart/checkout-item/checkout-item.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { ReceiptComponent } from '../components/checkout-orders/receipt/receipt.component';
import { RegistrationFormStepOneComponent } from '../components/register/registrationFormStepOne/registrationFormStepOne.component';
import { RegistrationFormStepTwoComponent } from '../components/register/registrationFormStepTwo/registrationFormStepTwo.component';
import { CheckoutSearchComponent } from '../components/checkout-orders/checkout-search/checkout-search.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ProductItemComponent,
    LoginComponent,
    ClientComponent,
    AdminComponent,
    CartComponent,
    AboutComponent,
    SummeryComponent,
    HomeComponent,
    ProductsComponent,
    MenuComponent,
    BannerComponent,
    RegisterComponent,
    RegistrationFormStepOneComponent,
    RegistrationFormStepTwoComponent,
    CheckoutComponent,
    StartShoppingComponent,
    CartItemComponent,
    SearchComponent,
    AddProductComponent,
    NewItemComponent,
    ShippingDetailsComponent,
    CheckoutCartComponent,
    CheckoutItemComponent,
    ReceiptComponent,
    CheckoutSearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule, RoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
  ],
  providers: [  
    UsersService,
    ProductsService,
    CartsService,
    , { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
