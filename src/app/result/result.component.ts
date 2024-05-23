import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private userService: UsersService,private calendar: NgbCalendar, private router: Router) {
    this.fromDate=calendar.getToday();
   }
   overlayResults2D:any=[];
  ngOnInit(): void {
    this.date = new Date();

    this.submitResultForm();

    setInterval(() => {
      this.submitResultForm(); 
    }, 60000);

  }
  submitted = false;
  currentUser = '';
  currentUserID='';
  showSuccess = false;
  showError = false;
  date = new Date();
  drawTime: any;
  time: any;
  timesArray = [];
  pointSummary:any;
  pointTotalSummary:any={};
  ticketSummary:any;
  seriesItems = [];
  fromDate!:NgbDateStruct;
  toDate = new Date();
  btnTypeClicked = 'pointSummary';

  checkBoxArray = [
    {label: "series0", value: 0, isChecked: true},
    {label: "series1", value: 1000, isChecked: false},
    {label: "series2", value: 2000, isChecked: false},
    {label: "series3", value: 3000, isChecked: false},
    {label: "series4", value: 4000, isChecked: false},
    {label: "series5", value: 5000, isChecked: false},
    {label: "series6", value: 6000, isChecked: false},
    {label: "series7", value: 7000, isChecked: false},
    {label: "series8", value: 8000, isChecked: false},
    {label: "series9", value: 9000, isChecked: false}];

    overlayResults:any=[];
   
    alphabet=['A','B','C','D','E','F','G','H','I','J'];
    alphabet2=['K','L','M','N','O','P','Q','R','S','T'];
    submitResultForm() {
      this.submitted = true;
     var month = this.date.getMonth()+1; //months from 1-12
     var day = this.date.getDate();
     var year = this.date.getFullYear();
     let dt: any = year+"-"+("0" + month).slice(-2) +"-"+ ("0" + day).slice(-2);
      this.showSuccess = true;
      this.userService.getResultGlobal(this.userService.getDate(this.fromDate)).subscribe(data => {       
      console.log('data-all-results==>'+data);
      this.overlayResults = data;
      this.overlayResults = this.overlayResults.reverse()
     // this.setResultsArray(); 
     },
     error => {
       console.log(error);        
     });
    }

    login(){
      this.router.navigate(['/login']);
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
