import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { URLs } from 'src/environments/urls';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { User } from '../users/user';
import { TicketHistory } from './TicketHistory';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  private dtElement!: DataTableDirective;

  dtTrigger: Subject<DataTableDirective> = new Subject();
  
  time!:any;
  dtOptions: DataTables.Settings = {};
  fromDate!:NgbDateStruct;
  toDate!:NgbDateStruct;
  toUser = '';
  game_type="1";
  ticketHistory!: TicketHistory[];
  loginUser!:User;
  isLoggedIn = false;
  showTable = true;
  showTickedDetails = false;
  constructor(private tokenStorageService: UserLogin,private calendar: NgbCalendar, private http: HttpClient, private sharedService: SharedServices) { 
    this.fromDate=calendar.getToday();
    this.toDate=calendar.getToday();
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.loginUser =JSON.parse(this.tokenStorageService.getToken());
    }
 
    this.showTable = true;
    this.searchUser();
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  formatter = (result: string) => result.toUpperCase();
  urls='ptickets/tickethistory/';
  rerender(): void {
    this.urls='ptickets/tickethistory/';
    if(this.game_type==="1" || this.game_type==="2"){
      this.urls='ptickets/tickethistory/';
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  
  search = (text$: Observable<string>) => {
    return text$.pipe(      
        debounceTime(200), 
        distinctUntilChanged(),
        // switchMap allows returning an observable rather than maps array
        switchMap( (searchText) =>  this.sharedService.getUserData(searchText) )        
    );                 
  }
  getHexString(ticketId:number){
    return ticketId.toString(16).toUpperCase();
  }

 /*  $scope.getDisplayValue = function(currentValue:number)
  {
   return currentValue;
  } */

  overlayResults:any=[];
  overlayResults2:any=[];
  alphabet=['A','B','C','D','E','F','G','H','I','J'];
    alphabet2=['K','L','M','N','O','P','Q','R','S','T'];
 // base = {00:A,b:2};
  viewTicket(ticketId:number){
    if(this.game_type==="1" || this.game_type==="2"){
    this.sharedService.getPTicketDetails(ticketId).subscribe(data => {       
      console.log('data-all-results==>'+data);
      this.overlayResults = data;
     },
     error => {
       console.log(error);        
     });
    }else{
      this.sharedService.getTicketDetails(ticketId).subscribe(data => {       
        console.log('data-all-results==>'+data);
        
        this.overlayResults = data;
        if(this.game_type==="2D"){
       
        }else{
          this.overlayResults = data;
        }
       },
       error => {
         console.log(error);        
       });
    }
    $("#showTable").hide();
    $("#showTickedDetails").show();
  }
  openTable(){
    this.showTickedDetails = false;
    $("#showTickedDetails").hide();
    $("#showTable").show();
  }
  
  searchUser(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      lengthChange:false,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            URLs.baseApiURL + this.urls + this.loginUser.userId + '/page?fdate=' + this.sharedService.getDateDefaultToday(this.fromDate) 
            + '&tdate=' + this.sharedService.getDateDefaultToday(this.toDate) 
            + '&touser=' + this.toUser + '&game_type='+this.game_type,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.ticketHistory = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'date', width: '90'}, { data: 'userName'}, { data: 'drawTime'}, { data: 'purchasePoints', width: '90'}, { data: 'winning' },{ data: 'ticketId' }, { data: 'status' },{ data: 'ticketId' }]
    };
  }

  tConvert(time:any) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
}
