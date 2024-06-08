import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserLogin } from '../services/user-login';
import { User } from '../users/user';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../services/users.service';
import { KeyValue } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SharedServices } from '../shared/SharedServices';
import { interval } from 'rxjs';

@Component({
  selector: 'app-gameload',
  templateUrl: './gameload.component.html',
  styleUrls: ['./gameload.component.css']
})
export class GameloadComponent implements OnInit,OnDestroy {

  isLoggedIn = false;
  loginUser!: User;
  reportuserId!: Number;
  data: any = [];
  keys: any = [];
  intervalue:any;
  gameType=1;
  isChecked: boolean = true;
  date:Date | undefined; 
  winningDisc: any;

  constructor(private tokenStorageService: UserLogin, private sharedService: SharedServices, private activatedRoute: ActivatedRoute, public service: UsersService, private toastr: ToastrService) { 
    setInterval(() => {
      this.date = new Date()
    }, 1000)
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalue);
  }
  logedInUser: any;
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.loginUser = JSON.parse(this.tokenStorageService.getToken());
    this.reportuserId = this.loginUser.userId;
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('userId') != null) {
        this.reportuserId = Number.parseInt(params.get('userId') + "");
      }
    });
    if (this.tokenStorageService.detectMob()) {
      let element: HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if (document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
    this.getSaleNumbers();
   this.intervalue = setInterval(() => {
      this.getSaleNumbers();
    }, 5000);

   
  }
 
  getSaleNumbers() {
    this.service.getSaleNumbers(this.gameType)
      .subscribe(
        response => {
          // this.data=response;
          console.log(response);
          this.data = response;

        },
        error => {
          console.log(error);
        });
  }
  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }

  keyDescOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return a.value.total > b.value.total ? -1 : (b.value.total > a.value.total ? 1 : 0);
  }


  winningUpdate(containerModel: HTMLElement, e: any) {
    if (e.target.checked) {
      containerModel.classList.remove("bg-success");
      containerModel.classList.add("bg-danger");
      this.toastr.error("Winning number added");
    } else {
      containerModel.classList.remove("bg-danger");
      containerModel.classList.add("bg-success");
      this.toastr.success("Winning number removed");
    }
    this.service.updateRemoveWinningNumber({ userId: this.loginUser.userId, winningNumber: e.target.value })
      .subscribe(
        response => {
          console.log(response);
          this.getSaleNumbers();
        },
        error => {
          this.toastr.error("Error in number added/remove");
        });
  }
  pointPassword = '';
  pointpassrequired = false;
  pointpasswrong = false;
  checkGenSetting() {
    this.pointpassrequired = false;
    this.pointpasswrong = false;
    if (this.pointPassword === '') {
      this.pointpassrequired = false;
      return;
    }
    this.sharedService.checkGeneralSettingPassword(this.loginUser.userId, this.pointPassword).subscribe(
      response => {
        $("#point-password").hide();
        $("#generalSetting").show();
        $("#javascript").click();
        this.getSaleNumbers();
      },
      error => {
        this.pointpasswrong = true;
      });
  }


}
