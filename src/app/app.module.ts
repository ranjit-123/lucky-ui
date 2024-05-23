import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule,routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NtpbyretialerComponent } from './ntpbyretialer/ntpbyretialer.component';
import { NtpbydistributorComponent } from './ntpbydistributor/ntpbydistributor.component';
import { CountersaleComponent } from './countersale/countersale.component';
import { CommissionComponent } from './commission/commission.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { PointsListComponent } from './points-list/points-list.component';
import { AddPointsComponent } from './add-points/add-points.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { GenralSettingComponent } from './genral-setting/genral-setting.component';
import { ResultComponent } from './result/result.component';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { AddEditComponentComponent } from './add-edit-component/add-edit-component.component';
import { DestributorhistoryComponent } from './destributorhistory/destributorhistory.component';
import { ToastrModule } from 'ngx-toastr';
import { GameloadComponent } from './gameload/gameload.component';

export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    routingComponents,
    NtpbyretialerComponent,
    NtpbydistributorComponent,
    CountersaleComponent,
    CommissionComponent,
    WithdrawComponent,
    PointsListComponent,
    AddPointsComponent,
    LoginComponent,
    GenralSettingComponent,
    ResultComponent,
    PasswordchangeComponent,
    AddEditComponentComponent,
    DestributorhistoryComponent,
    GameloadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    NgbModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      progressBar:true,
      progressAnimation:'increasing',
      preventDuplicates: true   
    }),
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useFactory: getBaseHref,
    deps: [PlatformLocation]
      }],
  bootstrap: [AppComponent]
})
export class AppModule { }
