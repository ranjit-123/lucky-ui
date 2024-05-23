import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AppService } from 'src/app.service';
import { URLs } from 'src/environments/urls';
import { UserLogin } from '../services/user-login';
import { SharedServices } from '../shared/SharedServices';
import { User } from '../users/user';
import { Point } from './point';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-points-list',
  templateUrl: './points-list.component.html',
  styleUrls: ['./points-list.component.css']
})
export class PointsListComponent implements AfterViewInit, OnDestroy, OnInit  {
  @ViewChild(DataTableDirective, {static: false})
  private dtElement!: DataTableDirective;

  dtTrigger: Subject<DataTableDirective> = new Subject();
  
  
  dtOptions: DataTables.Settings = {};
  points!: Point[];

  constructor(public service:AppService, private http: HttpClient,private tokenStorageService: UserLogin
    , private sharedService: SharedServices) {}
    isLoggedIn = false;

  fromDate!:NgbDateStruct;
  toDate!:NgbDateStruct;
  toUser!:Number;
  loginUser!:User;


  codec = new HttpUrlEncodingCodec;
  
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.loginUser =JSON.parse(this.tokenStorageService.getToken());
    }
    this.searchUser();
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
  }
  public model: any;

  formatter = (result: string) => result.toUpperCase();

  searchs: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
    search = (text$: Observable<string>) => {
      return text$.pipe(      
          debounceTime(200), 
          distinctUntilChanged(),
          // switchMap allows returning an observable rather than maps array
          switchMap( (searchText) =>  this.sharedService.getData(searchText) )        
      );                 
    }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  searchUser(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      lengthChange:false,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            URLs.baseApiURL + 'points/' + this.loginUser.userId + '/page?fdate=' + this.sharedService.getDate(this.fromDate) 
            + '&tdate=' + this.sharedService.getDate(this.toDate) + '&user=' + this.toUser ,
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.points = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'transactionId' },{ data: 'date', width: '90'}, { data: 'fromuser' }, { data: 'touser' }, { data: 'opning' }, { data: 'credit' }
      ,{ data: 'debit' } ,{ data: 'balance' } ,{ data: 'narration', width: '120' } ,{ data: 'nature' }]
    };
  }
}
