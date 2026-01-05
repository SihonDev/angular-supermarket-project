import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  @Input() item: any;

  public noProductFound: boolean = true

  constructor(private router: Router) { }

  public url = "http://localhost:3001/"

  ngOnInit() { }
}
