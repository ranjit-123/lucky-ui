import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { URLs } from 'src/environments/urls';
import { Observable } from 'rxjs';
import { UserDropdown } from '../shared/UserDropdown';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Users } from '../add-users/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  updateUser(userId: Number, status: number) {
    return this.http.post(URLs.baseApiURL + "users/"+ userId +"/status/" + status,null);
  }

  constructor(private http: HttpClient) { }

  create(data: any) {
    console.log(data);
    return this.http.post(URLs.baseApiURL + "users", data);
  }

  updateGeneralSetting(data: any){
    return this.http.post(URLs.baseApiURL + "general-settings", data);
  }

  getUsers(type: Number): Observable<UserDropdown[]> {
    return this.http
      .get<UserDropdown[]>(URLs.baseApiURL + "users/type/" + type)
  }

  getUsersByReporting(userId: Number): Observable<UserDropdown[]> {
    return this.http
      .get<UserDropdown[]>(URLs.baseApiURL + "users/by-reporting-user/" + userId)
  }

  getUsersById(userId:string) {
    return this.http
      .get(URLs.baseApiURL + "users/" + userId)
  }

  update(userId:string,data:any) {
    return this.http
      .post(URLs.baseApiURL + "users/updateUser/" + userId,data)
  }

  getGeneralSetting(){
    return this.http.get(URLs.baseApiURL + "general-settings");
  }

  updateWinningNumber(data:any){
    return this.http.post(URLs.baseApiURL + "general-settings/setWinningNumber", data);
  }

  updateRemoveWinningNumber(data:any){
    return this.http.post(URLs.baseApiURL + "general-settings/setupdateRemoveWinningNumber", data);
  }

  getupdatedWinningNumber(){
    return this.http.get<any>(URLs.baseApiURL + "general-settings/getGeneralSettingAll");
  }

  getWinningPointsOfWinningNumber(winningNumber:Number){
    return this.http.get<any>(URLs.baseApiURL + "general-settings/winningResult/"+winningNumber);
  }

  setGenWinning(genWinningNumber:Number){
return this.http.post(URLs.baseApiURL + "setgenwinning", genWinningNumber);
  }

  getResultGlobal(date:any){
    return this.http.get(URLs.baseApiURL + "results/forday?date="+ date);
  }

  getDate(date:NgbDateStruct) : String {
    if(date !== null && date !== undefined) {
      return date.year + '-' + date.month + '-' + date.day;
    } else {
      return '';
    }
  }

  getSaleNumbers(gameId:any){
    if(gameId==="4"){
      return this.http.get<any>(URLs.baseApiURL + "general-settings/getSalesTickets/");
    }else{
      return this.http.get<any>(URLs.baseApiURL + "general-settings/getSalesPTickets/"+gameId);
    }
    
  }

}
