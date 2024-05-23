import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app.service';
import { UserLogin } from './services/user-login';
//import Html from './pages/footer.html';  // Html file text import

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SkillUp';
  displaypage!:boolean;
  isLoggedIn = false;
  constructor(public service:AppService,public tokenStorageService: UserLogin) { 

  }
  ngOnInit(): void {
     this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
    }else{
      //window.location.href="/logout"
    }
  }
 
}

