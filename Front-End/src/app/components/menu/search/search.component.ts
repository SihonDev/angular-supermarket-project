import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/ProductsService';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  constructor(private router: Router, private productsService: ProductsService) { }

  public inputSearchText: string;

  @Output() passSearchedProducs = new EventEmitter<string>();

  ngOnInit() { }

  public reset() {
    this.inputSearchText = ''
  }


  public searchProduct() {
    if (this.inputSearchText == undefined || this.inputSearchText.trim() == '') {
      alert('Pleae fill the search bar')
    } else {
      const observable = this.productsService.searchProduct(
        this.inputSearchText.trim()
      );
      observable.subscribe(
        (successfulServerRequestData) => {
          console.log(successfulServerRequestData)
          let listOfSearchedProducs = successfulServerRequestData;
          this.passSearchedProducs.emit(listOfSearchedProducs);
        },
        (serverErrorResponse) => {
          alert('Error! Status: ' + serverErrorResponse.status +
            ', Message: ' + serverErrorResponse.error.error
          );
        }
      );
    }
  }
}
