import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/ProductsService';
import { UsersService } from 'src/app/services/UsersService';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  userIsAdmin: boolean = false;
  public email: string;
  public milkAndEggsActiveState: string = 'active';
  public vegetablesAndFruitsActiveState: string = 'active';
  public meatAndFishActiveState: string = 'active';
  public wineAndDrinksActiveState: string = 'active';
  public currentClickedCategory: any = 1;
  public categoriesOfProducts = [
    { id: 1, state: '' },
    { id: 2, state: '' },
    { id: 3, state: '' },
    { id: 4, state: '' },
  ];

  constructor(private router: Router, public productsService: ProductsService, public usersService: UsersService) {}

  ngOnInit() {
    let userType = sessionStorage.getItem('userType');
    if (userType == 'Admin') {
      this.userIsAdmin = true;
    }
    this.getProductsByCategory(1);
    this.productsService.findProductCategoryID(1);
  }

  public getProductsByCategory(id) {
    for (let i = 0; i < this.categoriesOfProducts.length; i++) {
      if (this.categoriesOfProducts[i].id == id) {
        this.categoriesOfProducts[i].state = 'active';
      } else {
        this.categoriesOfProducts[i].state = '';
      }
    }
  }

  public displayProductsByCategory(id) {
    this.currentClickedCategory = id;
    this.productsService.findProductCategoryID(this.currentClickedCategory);
    this.getProductsByCategory(id);
  }
}
