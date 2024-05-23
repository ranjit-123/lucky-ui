import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from 'src/environments/urls';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

  constructor(private http: HttpClient) { }

  create(data: any) {
    console.log(data);
   // const headers = { 'Access-Control-Allow-Origin': 'localhost:4200'} 
    return this.http.post(URLs.baseApiURL + "points", data);
  }

}
