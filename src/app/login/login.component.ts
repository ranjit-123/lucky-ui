import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from '../app.component';
import { UserLogin } from '../services/user-login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class LoginComponent implements OnInit {  
  loginUserObj={
    userName:'',
    userPassword:''
  };
  isLoggedIn = false;
  constructor(public service:UserLogin, @Inject(APP_BASE_HREF) private baseHref: string, private router: Router,private toastr: ToastrService) { }

 
  ngOnInit(): void {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
  }

  getLogin(){
    this.service.login(this.loginUserObj)
     .subscribe(
       response => {
         console.log(response);
         this.service.saveUser(response);
         this.isLoggedIn = true;
         //window.location.href = "/dashboard";
         this.router.navigate(['/ntpbyretialer']);
       },
       error => {
         console.log(error);
         //alert("User and Password is wrong..!");
         this.toastr.error("User and Password is wrong..!")
       });
 }

}
