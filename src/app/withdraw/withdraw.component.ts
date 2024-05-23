import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Point } from '../points-list/point';
import { PointsService } from '../services/points.service';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { UserDropdown } from '../shared/UserDropdown';
import { User } from '../users/user';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  constructor(public service:PointsService,private tokenStorageService: UserLogin
    ,private toastr: ToastrService, private sharedService:SharedServices,  @Inject(APP_BASE_HREF) private baseHref: string, private router: Router) { }
  
  rUsers!: UserDropdown[];
  loginUser!:User;
  users_type!:number;
  balance!:number;
  userbalance=0;

  pointpassrequired = false;
  pointpasswrong = false;
  pointPassword = '';

  point!:Point;
  

  isLoggedIn = false;
  ngOnInit(): void {
    this.point = new Point;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;

      console.log(this.tokenStorageService.getToken());
      this.loginUser =JSON.parse(this.tokenStorageService.getToken());

      this.getLoginUserBalance();
      console.log(this.loginUser.balance);
      this.fetchUserList(this.loginUser.userId);
    }
  }
  getLoginUserBalance(){
    this.sharedService.getUserBalanceByUserId(this.loginUser.userId).subscribe(
      response => {  
        this.balance=response;
        console.log(response);
      },
      error => {
        console.log(error);
      });
  }

  checkPointPassword(){
    this.pointpassrequired = false;
    this.pointpasswrong = false;
    if(this.pointPassword === '') {
      this.pointpassrequired = true;
      return;
    }
    this.sharedService.checkPointPassword(this.loginUser.userId, this.pointPassword).subscribe(
      response => {  
        $("#point-password").hide();
        $("#pointTransaction").show();
      },
      error => {
        this.pointpasswrong = true;
      });
  }
  
  onUserChange(deviceValue:any) {
    this.userbalance=0;
    this.fetchUserBalanceById(deviceValue);
  }

  fetchUserBalanceById(deviceValue:number)  {
    this.sharedService.getUserBalanceByUserId(deviceValue).subscribe(
      response => {  
        this.userbalance=response;
        console.log(response);
      },
      error => {
        console.log(error);
      });
  }
  fetchUserList(userId:Number) {
    this.sharedService.getUsers(userId).subscribe({
        next: data => {
            this.rUsers = data;
            console.log(this.rUsers);
        },
        error: error => {
            console.error('There was an error!', error);
        }
    });
  }

  withrawPoints() {
    this.point.narration="Point Withdraw";
    this.point.nature = "Debit";
       this.point.fromuser = this.loginUser.userId;  
       this.service.create(this.point)
        .subscribe(
          response => {
            //window.location.href=this.baseHref + "/pointslist";
            this.toastr.success("Withdraw Points Successfully");
            this.router.navigate(['/pointslist']);
          },
          error => {
            this.toastr.success("Withdraw Points Error..!");
            console.log(error);
          });
    }
}
