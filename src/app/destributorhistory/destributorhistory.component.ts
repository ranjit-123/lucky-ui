import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app.service';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { User } from '../users/user';
import { ActivatedRoute } from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Nettopay } from '../ntpbydistributor/nettopay';
import { UsersService } from '../services/users.service';
import { UserDropdown } from '../shared/UserDropdown';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

@Component({
  selector: 'app-destributorhistory',
  templateUrl: './destributorhistory.component.html',
  styleUrls: ['./destributorhistory.component.css']
})
export class DestributorhistoryComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  nettopays!: Nettopay[];
  ctotal: number = 0;
  dctotal: number = 0;
  ptotal: number = 0;
  sptotal: number = 0;
  twtotal: number = 0;
  tnptotal: number = 0;
  isLoggedIn = false;
  fromDate!: NgbDateStruct;
  toDate!: NgbDateStruct;
  toUser!: any;
  loginUser!: User;
  reportuserId!: Number;
  dFromDate!: String;
  dToDate!: String;

  title = 'jspdf-autotable-demo';
  head = [['Name', 'Total Sale', 'Total Win', 'Ret. Comm.', 'Dist Com.', 'Net Pay']];

  printData: any = [];

  constructor(public service: AppService, private http: HttpClient, private tokenStorageService: UserLogin
    , private sharedService: SharedServices, private calendar: NgbCalendar, private activatedRoute: ActivatedRoute, public userService: UsersService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();
  }

  ngOnInit(): void {
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload')
    //   location.reload()
    // } else {
    //   localStorage.removeItem('foo')
    // }
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.loginUser = JSON.parse(this.tokenStorageService.getToken());

    this.reportuserId = this.loginUser.userId;
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('userId') != null) {
        this.reportuserId = Number.parseInt(params.get('userId') + "");
      }
    });
    this.fetchUserList();
    if (this.tokenStorageService.detectMob()) {
      let element: HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if (document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
  }

  createPdf() {
    var doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Balance Sheet Summary (' + this.dFromDate + ' - ' + this.dToDate + ')', 14, 7);
    doc.setFontSize(11);
    doc.text('Distributor Name: '+this.toUser.userName , 14, 12);
    doc.setTextColor(100);

    var newArray = [];
    newArray.push("Total: ");
    newArray.push(this.sptotal.toFixed(2));
    newArray.push(this.twtotal);
    newArray.push(this.ctotal.toFixed(2));
    newArray.push(this.dctotal.toFixed(2));
    newArray.push(this.tnptotal.toFixed(2));
    this.printData.push(newArray);

    (doc as any).autoTable({
      head: this.head,
      body: this.printData,
      theme: 'grid',
      didDrawCell: (data: { column: { index: any; }; }) => {
        console.log(data.column.index)
      }
    })

    // Download PDF document  
    doc.save('dist_balance_sheet_' + this.sharedService.getDateDefaultTodayFromNull() + '.pdf');
  }
  searchUser() {
    this.dFromDate = this.sharedService.getDate(this.fromDate);
    this.dToDate = this.sharedService.getDate(this.toDate);
    this.sharedService.getNetToPayRetailerForSummary(this.fromDate, this.toDate, this.toUser.userId, this.toUser).subscribe({
      next: data => {
        this.nettopays = data;
        console.log(this.nettopays);
        this.ctotal = 0;
        this.ptotal = 0;
        this.sptotal = 0;
        this.twtotal = 0;
        this.tnptotal = 0;
        this.dctotal = 0;
        this.printData = [];
        for (let nettopay of this.nettopays) {
          var newArray = [];
          newArray.push(nettopay.userName + '(' + nettopay.displayUserId + ')');
          newArray.push(nettopay.salePoints.toFixed(2));
          newArray.push(nettopay.totalWinning.toFixed(2));
          newArray.push(nettopay.commition.toFixed(2));
          newArray.push(nettopay.dcommition.toFixed(2));
          newArray.push(nettopay.netPoints.toFixed(2));
          this.printData.push(newArray);
          this.ctotal = this.ctotal + nettopay.commition;
          this.sptotal = this.sptotal + nettopay.salePoints;
          this.twtotal = this.twtotal + nettopay.totalWinning;
          this.tnptotal = this.tnptotal + nettopay.netPoints;
          this.dctotal = this.dctotal + (nettopay.dcommition - nettopay.commition);
        }
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
  rUsers!: UserDropdown[];
  rtusers = {
    userId: '',
    UserName: ''
  }
  fetchUserList() {
    this.userService.getUsersByReporting(this.reportuserId).subscribe({
      next: data => {
        this.rUsers = data;
        this.toUser = data[0];
        console.log(this.rUsers);
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }

}
