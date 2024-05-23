import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { URLs } from 'src/environments/urls';
import { Observable, of } from 'rxjs';
import { UserDropdown } from '../shared/UserDropdown';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Nettopay } from '../ntpbydistributor/nettopay';
import { UserLogin } from '../services/user-login';


@Injectable({
  providedIn: 'root'
})
export class SharedServices {
  constructor(private http: HttpClient,private tokenStorageService: UserLogin) { }



  getUsers(userId: Number): Observable<UserDropdown[]> {
    return this.http
      .get<UserDropdown[]>(URLs.baseApiURL + "users/by-reporting-user/" + userId)
  }

  getUserBalanceByUserId(userId: Number): Observable<number> {
    return this.http
      .get<number>(URLs.baseApiURL + "points/balance/" + userId)

  }

  checkPointPassword(userId: Number, password:String): Observable<any> {
    return this.http
      .get<any>(URLs.baseApiURL + "login/pointlogin/" + userId + "?password=" + password)
  }

  checkGeneralSettingPassword(userId: Number, password:String): Observable<any> {
    return this.http
      .get<any>(URLs.baseApiURL + "login/general-pass/" + userId + "?password=" + password)
  }

  getDate(date:NgbDateStruct) : String {
    if(date !== null && date !== undefined) {
      return date.year + '-' + date.month + '-' + date.day;
    } else {
      return '';
    }
  }

  getDateDefaultToday(date:NgbDateStruct) : String {
    if(date !== null && date !== undefined) {
      return date.year + '-' + date.month + '-' + date.day;
    } else {
      return new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate();
    }
  }

  getDateDefaultTodayFromNull() : String {
      return new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate();
  }

  opts = [];
  
  getData(searchText:String) {
    return this.opts.length ?
      of(this.opts) :
      this.http.get<any>(URLs.baseApiURL + "users/displayUserId/" + searchText).pipe(tap(data => this.opts = data))
  }
  getUserData(searchText:String) {
    return this.opts.length ?
      of(this.opts) :
      this.http.get<any>(URLs.baseApiURL + "users/displayUserId/byuser/" + JSON.parse(this.tokenStorageService.getToken()).userId + "/" + searchText).pipe(tap(data => this.opts = data))
  }
  
  getNetToPayRetailer(fromDate:NgbDateStruct,toDate:NgbDateStruct,userId:Number, toUser:Number): Observable<Nettopay[]> {
    return this.http
      .get<Nettopay[]>(URLs.baseApiURL + "results/retailer-sales/"+ userId +"/"+this.getDate(fromDate) +"/"+this.getDate(toDate))
  }

  getNetToPayRetailerForSummary(fromDate:NgbDateStruct,toDate:NgbDateStruct,userId:Number, toUser:Number): Observable<Nettopay[]> {
    return this.http
      .get<Nettopay[]>(URLs.baseApiURL + "results/distbtr-summary/"+ userId +"/"+this.getDate(fromDate) +"/"+this.getDate(toDate))
  }

  getNetToPayDistributo(fromDate:NgbDateStruct,toDate:NgbDateStruct,userId:Number, toUser:Number): Observable<Nettopay[]> {
    return this.http
      .get<Nettopay[]>(URLs.baseApiURL + "results/distrubutors-sales/"+ userId +"/"+this.getDate(fromDate) +"/"+this.getDate(toDate))
  }

  getDashBoard(fromDate:NgbDateStruct,toDate:NgbDateStruct,userId:Number, toUser:Number): Observable<Nettopay[]> {
    return this.http
     .get<Nettopay[]>(URLs.baseApiURL + "results/distrubutors-sales-dashboard/"+ userId +"/"+this.getDate(fromDate) +"/"+this.getDate(toDate))
  }

  changePassword(userId:Number, oldPassword:string,npass:string) {
    return this.http.post<any>(URLs.baseApiURL+"users/changespassword/"+userId , { userId:userId,oldPassword: oldPassword, newPassword: npass })
  }

  getNetToPayDistributor(fromDate:NgbDateStruct,toDate:NgbDateStruct,userId:Number, toUser:Number): Observable<Nettopay[]> {
    return this.http
      .get<Nettopay[]>(URLs.baseApiURL + "results/distrubutors-sales/"+ userId +"/"+this.getDate(fromDate) +"/"+this.getDate(toDate))
  }

  getTicketDetails(ticketId:any){
    return this.http.get(URLs.baseApiURL + "tickets/ticketDetails/"+ ticketId);
  }

  getPTicketDetails(ticketId:any){
    return this.http.get(URLs.baseApiURL + "ptickets/ticketDetails/"+ ticketId);
  }

}
