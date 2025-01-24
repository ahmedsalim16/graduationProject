import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { UpdateComponent } from './update/update.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { Grade1Component } from './grade1/grade1.component';
import { Grade2Component } from './grade2/grade2.component';
import { Grade4Component } from './grade4/grade4.component';
import { Grade3Component } from './grade3/grade3.component';
import { Grade5Component } from './grade5/grade5.component';
import { Grade6Component } from './grade6/grade6.component';
import { CsvFileComponent } from './csv-file/csv-file.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminUpdateComponent } from './admin-update/admin-update.component';
import { AbsenceListComponent } from './absence-list/absence-list.component';
import { AuthGuard } from './auth.guard';

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
{ path: 'grade1', component:Grade1Component},
{ path: 'grade2', component:Grade2Component},
{ path: 'grade3', component:Grade3Component},
{ path: 'grade4', component:Grade4Component},
{ path: 'grade5', component:Grade5Component},
{ path: 'grade6', component:Grade6Component},
{ path: 'update/:id',component:UpdateComponent},
{ path: 'csv-file',component:CsvFileComponent},
{ path: '**', component:NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
