import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app.service';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { Nettopay } from './nettopay';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { User } from '../users/user';
import { ActivatedRoute } from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-ntpbydistributor',
  templateUrl: './ntpbydistributor.component.html',
  styleUrls: ['./ntpbydistributor.component.css']
})
export class NtpbydistributorComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  nettopays!: Nettopay[];
  ctotal:number=0;
  dctotal:number=0;
  ptotal:number=0;
  sptotal:number=0;
  twtotal:number=0;
  tnptotal:number=0;
  isLoggedIn = false;
  fromDate!:NgbDateStruct;
  toDate!:NgbDateStruct;
  toUser!:Number;
  loginUser!:User;
  reportuserId!: Number;
  dFromDate!:String;
  dToDate!:String;

  title = 'jspdf-autotable-demo';
  head = [['Name', 'Total Sale', 'Total Win', 'Ret. Comm.', 'Dist Com.', 'Net Pay']];

  printData:any=[];

  constructor(public service:AppService, private http: HttpClient,private tokenStorageService: UserLogin
    , private sharedService: SharedServices,private calendar: NgbCalendar, private activatedRoute: ActivatedRoute,private toastr: ToastrService) {
      this.fromDate=calendar.getToday();
      this.toDate=calendar.getToday();
    }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.loginUser =JSON.parse(this.tokenStorageService.getToken());
    
    this.reportuserId = this.loginUser.userId;
    this.activatedRoute.paramMap.subscribe(params => {
      if(params.get('userId') != null) {
        this.reportuserId = Number.parseInt(params.get('userId')+"");
      }
    });
    this.searchUser();
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
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
    
    download() {
        var doc = new jsPDF('p', 'px', 'a4');
        const element = document.getElementById('pdfTable') as HTMLInputElement;
        doc.setFontSize(10);
        var html = "<html><style>td{font-size:10px;}</style><body>" + element.innerHTML + "</body></html>";
        doc.html(html, {
          callback: function (doc) {
            doc.save('test.pdf');
          }
        });
    } 
    createPdf() {
      var doc = new jsPDF();
  
      doc.setFontSize(18);
      doc.text('Balance Sheet Summary (' + this.dFromDate + ' - ' + this.dToDate + ')', 14, 8);
      doc.setFontSize(11);
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
      
  
      // Open PDF document in new tab
      //doc.output('dataurlnewwindow')
  
      // Download PDF document  
      doc.save('dist_balance_sheet_'+ this.sharedService.getDateDefaultTodayFromNull() +'.pdf');
    }  
  searchUser(){
    this.dFromDate = this.sharedService.getDate(this.fromDate);
    this.dToDate = this.sharedService.getDate(this.toDate);
    this.sharedService.getNetToPayDistributo(this.fromDate,this.toDate,this.reportuserId, this.toUser).subscribe({
      next: data => {
          this.nettopays = data;
          console.log(this.nettopays);
          this.ctotal=0;
          this.ptotal=0;
          this.sptotal=0;
          this.twtotal=0;
          this.tnptotal=0;
          this.dctotal = 0;
          this.printData = [];
          for(let nettopay of this.nettopays){
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
            this.tnptotal = this.tnptotal +  nettopay.netPoints;
            this.dctotal = this.dctotal + (nettopay.dcommition - nettopay.commition);
            //this.toastr.success("Success message", "Dist Message")
          }

          
      },
      error: error => {
          console.error('There was an error!', error);
      }
  });
  }


}
