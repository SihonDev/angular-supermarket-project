import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from '../components/customer/client/client.component';
import { AdminComponent } from '../components/admin/admin.component';
import { HomeComponent } from '../components/home/home.component';
import { RegisterComponent } from '../components/register/register.component';
import { CheckoutComponent } from '../components/checkout-orders/checkout/checkout.component';
import { AdminGuard } from '../guards/admin.guard';
import { ClientGuard } from '../guards/client.guard';
import { ReceiptComponent } from '../components/checkout-orders/receipt/receipt.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "admin", canActivate: [AdminGuard], component: AdminComponent },
  { path: "shop", canActivate: [ClientGuard], component: ClientComponent},
  { path: "checkout", component: CheckoutComponent},
  { path: "receipt", component: ReceiptComponent},
  { path: 'register', component: RegisterComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) 
  ]
})
export class RoutingModule {

}
