import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app.service';
import { Nettopay } from '../ntpbydistributor/nettopay';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { User } from '../users/user';
import jsPDF from "jspdf";
import "jspdf-autotable";


class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

@Component({
  selector: 'app-ntpbyretialer',
  templateUrl: './ntpbyretialer.component.html',
  styleUrls: ['./ntpbyretialer.component.css']
})

export class NtpbyretialerComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  nettopays!: Nettopay[];
  ctotal:number=0;
  ptotal:number=0;
  sptotal:number=0;
  twtotal:number=0;
  tnptotal:number=0;
  isLoggedIn = false;
  fromDate!:NgbDateStruct;
  toDate!:NgbDateStruct;
  toUser!:Number;
  loginUser!:User;
  dFromDate!:String;
  dToDate!:String;
  
  head = [['Name', 'Total Sale', 'Total Win', 'Ret. Comm.', 'Net Pay']];

  printData:any=[];


  constructor(public service:AppService, private http: HttpClient,private tokenStorageService: UserLogin
    , private sharedService: SharedServices,private calendar: NgbCalendar) {
      this.fromDate=calendar.getToday();
      this.toDate=calendar.getToday();
    }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.loginUser =JSON.parse(this.tokenStorageService.getToken());
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(element !== null)
        element.click();
    }
    this.searchUser();
  }

  createPdf() {
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Ret. Balance Sheet Summary (' + this.dFromDate + ' - ' + this.dToDate + ')', 14, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);
    
    var newArray = [];
    newArray.push("Total: ");
    newArray.push(this.sptotal.toFixed(2));
    newArray.push(this.twtotal);
    newArray.push(this.ctotal.toFixed(2));
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
    doc.save('ret_balance_sheet_'+ this.sharedService.getDateDefaultTodayFromNull() +'.pdf');
  }  

  formatter = (result: string) => result.toUpperCase();

    search = (text$: Observable<string>) => {
      return text$.pipe(      
          debounceTime(200), 
          distinctUntilChanged(),
          // switchMap allows returning an observable rather than maps array
          switchMap( (searchText) =>  this.sharedService.getData(searchText) )        
      );                 
    }
  searchUser(){
    this.dFromDate = this.sharedService.getDate(this.fromDate);
    this.dToDate = this.sharedService.getDate(this.toDate);
    this.sharedService.getNetToPayRetailer(this.fromDate,this.toDate,this.loginUser.userId,this.toUser).subscribe({
      next: data => {
          this.nettopays = data;
          console.log(this.nettopays);
          this.ctotal=0;
          this.ptotal=0;
          this.sptotal=0;
          this.twtotal=0;
          this.tnptotal=0;
          this.printData = [];
          for(let nettopay of this.nettopays){
            var newArray = [];
            newArray.push(nettopay.userName + '(' + nettopay.displayUserId + ')');
            newArray.push(nettopay.salePoints.toFixed(2));
            newArray.push(nettopay.totalWinning.toFixed(2));
            newArray.push(nettopay.commition.toFixed(2));
            newArray.push(((nettopay.salePoints  -  nettopay.totalWinning) - nettopay.commition).toFixed(2));
            this.printData.push(newArray);
            this.ctotal = this.ctotal + nettopay.commition;
            this.sptotal = this.sptotal + nettopay.salePoints;
            this.twtotal = this.twtotal + nettopay.totalWinning;
            this.tnptotal = this.tnptotal + (nettopay.salePoints  -  nettopay.totalWinning) - nettopay.commition;
          }
      },
      error: error => {
          console.error('There was an error!', error);
      }
  });
  }


}
