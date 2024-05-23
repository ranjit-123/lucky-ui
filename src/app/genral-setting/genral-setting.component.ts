import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../services/user-login';
import {UsersService} from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServices } from '../shared/SharedServices';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-genral-setting',
  templateUrl: './genral-setting.component.html',
  styleUrls: ['./genral-setting.component.css']
})
export class GenralSettingComponent implements OnInit {
  userId!: String;
  logedInUser:any;
  isLoggedIn = false;
  submitted = false;
  constructor(private toastr: ToastrService,private tokenStorageService: UserLogin ,private sharedService:SharedServices,public service:UsersService, private router: Router) { }
  genwinning:any;
  pgenwinning:any;
  pgenwinning_3:any;
  winningNumber1D:any;
  winningNumber3D:any;
  winningNumber:any=['','','','',''];
  notificationmessage:any;
  resulttype:Number=-1;
  data:any=[];
  totalWin:Number=0;
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.logedInUser =  JSON.parse(this.tokenStorageService.getToken());
      if(this.logedInUser.type !== '4') {
        this.router.navigate(['/login']);
      }
    }
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(element !== null)
        element.click();
    }
    //this.getGenSetting();
    this.getupdateWinningNumber();
    
  }
  updateGenSetting(){
    this.service.updateGeneralSetting({userId:this.logedInUser.userId, winningPercentage:this.genwinning,pwinningPercentage:this.pgenwinning,pwinningPercentage_3:this.pgenwinning_3,notificationMessage:this.notificationmessage,resultType:this.resulttype})
    .subscribe(
      response => {
        console.log(response);
        this.toastr.success("Update Successfully");
        this.submitted = true;
      },
      error => {
        console.log(error);
      }); 
  }

  getGenSetting(){
    this.service.getGeneralSetting()
    .subscribe(
      response => {
        this.genwinning = response;
        this.submitted = true;
      },
      error => {
        console.log(error);
      }); 
  }

  updateWinningNumber(){
    this.winningNumber.forEach((element: string | any[]) => {
      if(element != "" && element.length!=4) {
        this.toastr.success("Invalid Ticket Number..!");
        return;
      }
    });

    console.log(this.winningNumber.toString());
    
    this.service.updateWinningNumber({userId:this.logedInUser.userId, winningNumber:this.winningNumber.toString(),winningNumber1D:this.winningNumber1D,winningNumber3D:this.winningNumber3D})
    .subscribe(
      response => {
        console.log(response);
        this.toastr.success("Update Successfully");
        this.submitted = true;
        this.getWinningPointsOfWinningNumber(this.winningNumber.toString());
      },
      error => {
        console.log(error);
      });
    
  }

  getupdateWinningNumber(){
    this.service.getupdatedWinningNumber()
    .subscribe(
      response => {
        console.log(response);
        this.winningNumber = response.winningNumber.split(",", 5);
        this.genwinning = response.winningPercentage;
        this.notificationmessage=response.notificationMessage;
        this.resulttype=response.resultType;
        this.pgenwinning=response.pwinningPercentage;
        this.pgenwinning_3=response.pwinningPercentage_3;
        this.submitted = true;
        this.getWinningPointsOfWinningNumber(this.winningNumber.toString());
      },
      error => {
        console.log(error);
      }); 
  }
 
  onChangeWinning(event: any, index:number){
    var str = new String(this.winningNumber[index]);
    if(str.length==4){
      console.log(this.winningNumber.toString());
      this.getWinningPointsOfWinningNumber(this.winningNumber.toString());
    }
}

  getWinningPointsOfWinningNumber(winningNumber:Number){
  
    this.service.getWinningPointsOfWinningNumber(winningNumber)
    .subscribe(
      response => {
        this.data=response;
        this.totalWin=0;
        for(let win of this.data){
          this.totalWin = this.totalWin + win.winningAmount;
        }
      },
      error => {
        console.log(error);
      }); 
  }

  pointPassword = '';
  pointpassrequired = false;
  pointpasswrong = false;

  checkGenSetting(){
    this.pointpassrequired = false;
    this.pointpasswrong = false;
    if(this.pointPassword === '') {
      this.pointpassrequired = true;
      return;
    }
    this.sharedService.checkGeneralSettingPassword(this.logedInUser.userId, this.pointPassword).subscribe(
      response => {  
        $("#point-password").hide();
        $("#generalSetting").show();
      },
      error => {
        this.pointpasswrong = true;
      });
  }

}
