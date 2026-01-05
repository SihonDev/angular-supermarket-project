import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-search',
  templateUrl: './checkout-search.component.html',
  styleUrls: ['./checkout-search.component.css']
})
export class CheckoutSearchComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}
  public inputSearchText: string;

  @Output() passSearchedProducsFromCheckout = new EventEmitter<string>();

  ngOnInit() {}

  public reset() {
    this.inputSearchText = ''
    this.passSearchedProducsFromCheckout.emit(this.inputSearchText);
  }
  
  public sendSearchedProductQuery() {
    if (this.inputSearchText == undefined || this.inputSearchText.trim() == '') {
      alert('Pleae fill the search bar');
    } else {
      this.passSearchedProducsFromCheckout.emit(this.inputSearchText);
    }
  }
}
