import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PointsService } from '../services/points.service';
import { UserLogin } from '../services/user-login';


@Component({
  selector: 'app-add-points',
  templateUrl: './add-points.component.html',
  styleUrls: ['./add-points.component.css']
})
export class AddPointsComponent implements OnInit {

  constructor(public service:PointsService,private tokenStorageService: UserLogin,private toastr: ToastrService) { }
  users_type!:'';
  selectedUser={
    userId!:'',
    balance!:'',
  };
  loginUser={
    userId!:'',
    balancepoints!:'',
  };
  point={
      fromuser!:Number,
     touser!:Number,
     openingBalance!:Number,
     credit!:Number,
     debit!:Number,
     balance!:Number,
     narration:'Credit',
     nature:'Credit'
  }
  
  isLoggedIn = false;
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
    }
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(element !== null)
        element.click();
    }
  }
  
  addPoints() {
       this.service.create(this.point)
        .subscribe(
          response => {
            console.log(response);
            this.toastr.success("Point Added Successsfuly");
            window.location.href="/pointslist";
          },
          error => {
            console.log(error);
          });
    }
}
