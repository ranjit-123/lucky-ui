import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app.service';
import { HttpClient } from '@angular/common/http'
import { User } from './user';
import { UsersService } from '../services/users.service';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';
import { UserLogin } from '../services/user-login';
import { URLs } from 'src/environments/urls';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SharedServices } from '../shared/SharedServices';

class DataTablesResponse {
  data!: any[];
  draw!: number;
  recordsFiltered!: number;
  recordsTotal!: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, {static: false})
  private dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  persons!: User[];
  userName = '';
  loginUser!:User;

  constructor(public service:AppService, private http: HttpClient,private tokenStorageService: UserLogin,public userService:UsersService, private router: Router, private sharedService: SharedServices) {}
  dtTrigger: Subject<DataTableDirective> = new Subject();
  

  isLoggedIn = false;
  
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.loginUser =JSON.parse(this.tokenStorageService.getToken());
    }
    if(this.tokenStorageService.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(document.getElementsByClassName("sidebar-open").length > 0)
        element.click();
    }
    const that = this;
    //const that = this;
    this.loadTable();
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(      
        debounceTime(200), 
        distinctUntilChanged(),
        // switchMap allows returning an observable rather than maps array
        switchMap( (searchText) =>  this.sharedService.getUserData(searchText) )        
    );
                    
  }

  loadTable(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      lengthChange:false,
      responsive: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            URLs.baseApiURL + 'users/' + this.loginUser.userId +'/' + this.loginUser.type + '/pageUi?userName=' + this.userName,
            dataTablesParameters, {}
          ).subscribe(resp => {
            this.persons = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'userId' }, { data: 'displayUserId' }, { data: 'userName' }, { data: 'type' }, { data: 'refernceUserId' }, { data: 'commition'}
      ,{ data: 'status' }, { data: 'userId', width: '100'}]
    };
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

  activateUser(userId:Number){
    console.log(userId);
    this.userService.updateUser(userId, 1)
      .subscribe(
        res => {
          this.rerender();
        },
        error => {
          this.rerender();
          console.log(error);
        });
  }

  searchUser(){
    this.rerender();
  }

  viewNetToPay(userId:Number){
    this.router.navigate(['/ntpbydistributor/' + userId]);
  }

  deActivateUser(userId:Number){
    console.log(userId);
    this.userService.updateUser(userId, 0)
      .subscribe(
        res => {
          this.rerender();
        },
        error => {
          this.rerender();
          console.log(error);
        });
  }
}
