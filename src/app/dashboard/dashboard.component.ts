import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app.service';
import { Nettopay } from '../ntpbydistributor/nettopay';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { User } from '../users/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public service:AppService, private tokenStorageService: UserLogin, private sharedService: SharedServices,private calendar: NgbCalendar) { 
    this.fromDate=calendar.getToday();
      this.toDate=calendar.getToday();
  }

  nettopays!: Nettopay[];
  ctotal:number=0;
  dctotal:number=0;
  ptotal:number=0;
  sptotal:number=0;
  twtotal:number=0;
  tnptotal:number=0;
  fromDate!:NgbDateStruct;
  toDate!:NgbDateStruct;
  isLoggedIn = false;
  loginUser!:User;
  
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.loginUser = JSON.parse(this.tokenStorageService.getToken());
    }
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
    this.searchUser();
  }

  searchUser(){
    this.sharedService.getDashBoard(this.fromDate,this.toDate,this.loginUser.userId, 0).subscribe({
      next: data => {
         // this.nettopays = data;
         this.nettopays = [];
          data.forEach((element)=>{
            if(element.sale>0) {
              this.nettopays.push(element);
            }
          });
          console.log(this.nettopays);
          this.ctotal=0;
          this.ptotal=0;
          this.sptotal=0;
          this.twtotal=0;
          this.tnptotal=0;
          this.dctotal = 0;
          for(let nettopay of this.nettopays){
            this.ctotal = this.ctotal + nettopay.commition;
            this.sptotal = this.sptotal + nettopay.sale;
            this.twtotal = this.twtotal + nettopay.winning;
            this.tnptotal = this.tnptotal + nettopay.netPoints;           
            if(this.loginUser.type === '4' || this.loginUser.type === '3') {
              this.dctotal = this.dctotal + nettopay.dcommision + nettopay.commision;
            } else {
              this.dctotal = this.dctotal + nettopay.dcommision;
            }
          }
          
      },
      error: error => {
          console.error('There was an error!', error);
      }
  });
  }

}
