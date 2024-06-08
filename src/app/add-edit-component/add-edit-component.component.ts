import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserLogin } from '../services/user-login';
import { UsersService } from '../services/users.service';
import { UserDropdown } from '../shared/UserDropdown';

@Component({
  selector: 'app-add-edit-component',
  templateUrl: './add-edit-component.component.html',
  styleUrls: ['./add-edit-component.component.css']
})
export class AddEditComponentComponent implements OnInit {

    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    dtusers={
      userId:'',
      userName:'',
      displayUserId:''
    }
  
    rUsers!: UserDropdown[];
    selectedUser!: Number;
  
    rtusers={
      userId:'',
      UserName:''
    }

  constructor(
    public service:UsersService ,
    private tokenStorageService: UserLogin,
    private activatedRoute: ActivatedRoute,
     @Inject(APP_BASE_HREF) private baseHref: string,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) { }
  
  isLoggedIn = false;
  logedInUser:any;
  userId!: string;

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.isLoggedIn = true;
      this.logedInUser =  JSON.parse(this.tokenStorageService.getToken());
    }

    this.fetchUserList();
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['userId'];
  }); 

  this.form = this.formBuilder.group({
    userName: [''],
    type: [''],
    refernceUserId: [''],
    commition: [''],
    winingDistribution: [''],
    maxwining: [''],
    status: [''],
    password:[''],
    pointPassword:[''],
    winning_limit_upto: [''],
    winningPercent:['']
});

if(this.userId){
  this.service.getUsersById(this.userId)
  .pipe(first())
  .subscribe(x => this.form.patchValue(x) );
}

  }

  fetchUserList() {
    this.service.getUsers(2).subscribe({
      next: data => {
          this.rUsers = data;
          console.log(this.rUsers);
      },
      error: error => {
          console.error('There was an error!', error);
      }
  });
  }

  updateUser() {
    this.service.update(this.userId, this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
             
              this.toastr.success("User Added Successfully..");
              this.router.navigate(['/users']);
            },
            error: error => {
              console.log(error);
              this.toastr.error("Error ! User Not Updated..")
            }
        });
}

     // convenience getter for easy access to form fields
     get f() { return this.form.controls; }
}
