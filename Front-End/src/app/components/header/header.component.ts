import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() firstName
  @Input() isLoggedIn: boolean =true;
  @Output() logoutMessageToParent = new EventEmitter<any>();

  ngOnInit(): void {
    this.firstName = sessionStorage.getItem('firstName');
  }


  public logout() {
    this.sendLogoutMesageToParent(true)
    sessionStorage.clear();
    this.firstName = 'Guest';
    this.router.navigate(['']);
  }

  public sendLogoutMesageToParent(value: any) {
    this.logoutMessageToParent.emit(value);
  }

}
