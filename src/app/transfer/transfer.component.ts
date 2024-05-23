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
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  constructor(public service:PointsService,private tokenStorageService: UserLogin
    , private sharedService:SharedServices,  @Inject(APP_BASE_HREF) private baseHref: string, private router: Router,private toastr: ToastrService) { }
  
  rUsers!: UserDropdown[];
  loginUser!:User;
  users_type!:number;
  balance!:number;
  userbalance=0;
  pointPassword = '';
  point!:Point;
  pointpassrequired = false;
  pointpasswrong = false;
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
  onChange(deviceValue:any) {
    this.fetchUserList(deviceValue);
    this.userbalance=0;
  }
  onUserChange(deviceValue:any) {
    this.fetchUserBalanceById(deviceValue);
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

  addPoints() {
    this.point.narration="Point Transefered";
    this.point.nature = "Credit";
       this.point.fromuser = this.loginUser.userId;  
       this.service.create(this.point)
        .subscribe(
          response => {
            //window.location.href= this.baseHref + "/pointslist";
            this.toastr.success("Point Added Successfully");
            this.router.navigate(['/pointslist']);
          },
          error => {
            this.toastr.error("Point Added Failed");
            console.log(error);
          });
    }
   
}
