import { GeneratedFile } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component'
import { AddEditComponentComponent } from './add-edit-component/add-edit-component.component';
import { AddPointsComponent } from './add-points/add-points.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { CommissionComponent } from './commission/commission.component';
import { CountersaleComponent } from './countersale/countersale.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DestributorhistoryComponent } from './destributorhistory/destributorhistory.component';
import { GenralSettingComponent } from './genral-setting/genral-setting.component';
import { NtpbydistributorComponent } from './ntpbydistributor/ntpbydistributor.component';
import { NtpbyretialerComponent } from './ntpbyretialer/ntpbyretialer.component';
import { PasswordchangeComponent } from './passwordchange/passwordchange.component';
import { PointsListComponent } from './points-list/points-list.component';
import { ResultComponent } from './result/result.component';
import { TransferComponent } from './transfer/transfer.component';
import { UsersComponent } from './users/users.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { GameloadComponent } from './gameload/gameload.component';



const routes: Routes = [
  {path:'login',component: LoginComponent},
  {path:'dashboard',component: DashboardComponent},
  {path:'users',component: UsersComponent},
  {path:'add-users',component: AddUsersComponent},
  {path:'edit-users',component:AddEditComponentComponent},
  {path:'ntpbyretialer',component: NtpbyretialerComponent},
  {path:'ntpbydistributor',component: NtpbydistributorComponent},
  {path:'ntpbydistributor/:userId',component: NtpbydistributorComponent},
  {path:'countersale',component: CountersaleComponent},
  {path:'retailer-history',component: CommissionComponent},
  {path:'transfer',component: TransferComponent},
  {path:'withdraw',component: WithdrawComponent},
  {path:'pointslist',component: PointsListComponent},
  {path:'addPoints',component: AddPointsComponent},
  {path:'genral-setting',component: GenralSettingComponent},
  {path:'result',component: ResultComponent},
  {path:'passwordchange',component: PasswordchangeComponent},
  {path:'distributorhistory',component: DestributorhistoryComponent},
  {path:'gameload',component: GameloadComponent},
  { path: '',   redirectTo: '/result', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent,LoginComponent,AddUsersComponent,
   UsersComponent,CountersaleComponent,NtpbydistributorComponent,NtpbyretialerComponent,
   CommissionComponent,TransferComponent,WithdrawComponent,PointsListComponent,AddPointsComponent,GenralSettingComponent,ResultComponent, PasswordchangeComponent,DestributorhistoryComponent,GameloadComponent]
