import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { User } from '../users/user';

@Component({
  selector: 'app-passwordchange',
  templateUrl: './passwordchange.component.html',
  styleUrls: ['./passwordchange.component.css']
})
export class PasswordchangeComponent implements OnInit {
  

  constructor(private sharedService: SharedServices, private tokenStorageService: UserLogin) { 

  }
  
  
  showSuccess = false;
  isLoggedIn = false;
  submitted = false;
  passwordrequired = false;
  oldpassrequired = false;
  showerror = false;
  loginUser!:User;
  newPass = '';
  oldPass = '';
  errorMessage = '';
  
  ngOnInit(): void {

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.loginUser = JSON.parse(this.tokenStorageService.getToken());
    }

    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(element !== null)
        element.click();
    }
  }

  
  submitChange() {
    this.oldpassrequired = false;
    this.passwordrequired = false;
    this.showerror = false;
    this.showSuccess = false;
    if(this.oldPass === '') {
      this.oldpassrequired = true;
      return;
    }
    if(this.newPass === ''){
      this.passwordrequired = true;
      return;
    }
   
    this.sharedService.changePassword(this.loginUser.userId, this.oldPass,this.newPass).subscribe({
      next: data => {
         this.showSuccess = true;
      },
      error: error => {
          console.error('There was an error!', error);
          this.errorMessage = error.error.message;
          this.showerror = true;
      }
  });
 
  }

}
