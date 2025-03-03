import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { UpdateComponent } from './update/update.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { CsvFileComponent } from './csv-file/csv-file.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminUpdateComponent } from './admin-update/admin-update.component';
import { AbsenceListComponent } from './absence-list/absence-list.component';
import { AuthGuard } from './services/auth.guard';
import { MessagesComponent } from './messages/messages.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AddSchoolComponent } from './managers/add-school/add-school.component';
import { SchoolListComponent } from './managers/school-list/school-list.component';
import { UpdateSchoolComponent } from './managers/update-school/update-school.component';
import { AddOwnerComponent } from './managers/add-owner/add-owner.component';

const routes: Routes = [
{ path: '', redirectTo:'/welcome',pathMatch:'full' },
{ path: 'welcome', component:WelcomeComponent },
{ path: 'Dashboard', component:DashboardComponent,canActivate: [AuthGuard] },
{ path: 'login', component:LoginComponent },
{ path: 'student', component:StudentComponent ,canActivate: [AuthGuard]},
{ path: 'Add-admin', component:AdminComponent ,canActivate: [AuthGuard]},
{ path: 'header', component: HeaderComponent },
{ path: 'student-list', component:StudentListComponent,canActivate: [AuthGuard]},
{ path: 'admin-list', component:AdminListComponent,canActivate: [AuthGuard]},
{ path: 'admin-update/:id', component:AdminUpdateComponent},
{ path: 'absence-list', component:AbsenceListComponent,canActivate: [AuthGuard]},
{ path: 'update/:id',component:UpdateComponent},
{ path: 'Send-email',component:MessagesComponent,canActivate: [AuthGuard]},
{ path: 'forgot-password',component:ForgetPasswordComponent},
{ path: 'reset-password',component:ResetPasswordComponent},
{ path: 'unauthorized', component: UnauthorizedComponent },
{ path: 'add-school', component: AddSchoolComponent ,canActivate: [AuthGuard]},
{ path: 'school-list', component: SchoolListComponent ,canActivate: [AuthGuard]},
{ path: 'update-school/:id', component: UpdateSchoolComponent},
{ path: 'add-owner', component: AddOwnerComponent ,canActivate: [AuthGuard]},
{ path: 'csv-file',component:CsvFileComponent},
{ path: '**', component:NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
