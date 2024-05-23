import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app.service';
import { AppComponent } from '../app.component';
import { UserLogin } from '../services/user-login';
import { User } from '../users/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public service:AppService,private tokenStorageService: UserLogin, @Inject(APP_BASE_HREF) private baseHref: string, private router: Router) { 

  }
  isLoggedIn = false;
  isShowCloseIcon = false;
  loginUser!:User;
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.loginUser =JSON.parse(this.tokenStorageService.getToken());
    }

    this.isShowCloseIcon = this.tokenStorageService.detectMob();
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }
  
}
