import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLs } from "src/environments/urls";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class UserLogin {

    
  constructor(private http: HttpClient) { }

  login(data: any) {
    console.log(data);
   // const headers = { 'Access-Control-Allow-Origin': 'localhost:4200'} 
    return this.http.post(URLs.baseApiURL + "login", data);
  }

  public getToken(): any | null {
    if(this.detectMob()) {
      let element:HTMLElement = document.getElementById("closemenu") as HTMLElement;
      if(element !== null)
        element.click();
    }
    return window.sessionStorage.getItem(USER_KEY);
  }

  signOut(): void {
    window.sessionStorage.clear();
  }
  public saveUser(response:any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(response));
  }

  detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

}
