import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UsersService} from 'src/app/services/users.service';
import { UserLogin } from '../services/user-login';
import { UserDropdown } from '../shared/UserDropdown';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {

  dtusers={
    userId:'',
    userName:'',
    displayUserId:''
  }

  rUsers!: UserDropdown[];
  selectedUser!: Number;

  rtusers={
    userId:'',
    UserName:''
  }
  users = {
    userName:'',
    type: '',
    refernceUserId: '',
    commition:'',
    winingDistribution:'',
    maxwining:'',
    bonus_percent:'',
    status:'',
    published: false
  };
  submitted = false;
  
  userId!: String;
  logedInUser:any;

  constructor(public service:UsersService ,private tokenStorageService: UserLogin, private activatedRoute: ActivatedRoute, @Inject(APP_BASE_HREF) private baseHref: string, private router: Router) { }

  isLoggedIn = false;
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.logedInUser =  JSON.parse(this.tokenStorageService.getToken());
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['userId'];
  }); 

  if(this.tokenStorageService.detectMob()) {
    let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
    if(element !== null)
      element.click();
  }

  }
  saveUser() {
     this.service.create(this.users)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
         // window.location.href= this.baseHref + "/users";
         alert("User Added Successsfuly");
          this.router.navigate(['/users']);
        },
        error => {
          console.log(error);
        });
  }

}
