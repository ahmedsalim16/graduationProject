import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { UpdateComponent } from './update/update.component';
import { FilterPipe } from './filter.pipe';
import { LoginComponent } from './login/login.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { customeInterceptor } from './custome.interceptor';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CsvFileComponent } from './csv-file/csv-file.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminComponent } from './admin/admin.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminUpdateComponent } from './admin-update/admin-update.component';
import { AbsenceListComponent } from './absence-list/absence-list.component';
import { SignalRService } from './services/signalr.service';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthService } from './services/auth.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AddSchoolComponent } from './managers/add-school/add-school.component';
import { SchoolListComponent } from './managers/school-list/school-list.component';
import { UpdateSchoolComponent } from './managers/update-school/update-school.component';
import { AddOwnerComponent } from './managers/add-owner/add-owner.component';
import { authInterceptor } from './services/auth.interceptor';
import { AdminDashboardComponent } from './managers/admin-dashboard/admin-dashboard.component';
import { ParentListComponent } from './parent-list/parent-list.component';
import { AddDeveloperComponent } from './managers/add-developer/add-developer.component';
import { DevelopersComponent } from './managers/developers/developers.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessagesComponent } from './messages/messages.component';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { SelectButtonModule } from 'primeng/selectbutton';
// import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
// import { LanguageService } from './services/language.service';
import { PrimeNGConfig } from 'primeng/api';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { ManagersListComponent } from './managers/managers-list/managers-list.component';

// دالة لتحميل ملفات الترجمة
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// // دالة تهيئة خدمة اللغة
// export function initLanguageServiceFactory(
//   languageService: LanguageService
// ) {
//   return () => {
//     return Promise.resolve(languageService.initialize());
//   };
// }
// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// // مزود لتهيئة خدمة اللغة
// export function initLanguageServiceFactory(langService: LanguageService) {
//   return () => langService.initialize();
// }

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    NotfoundComponent,
    HeaderComponent,
    UpdateComponent,
    FilterPipe,
    LoginComponent,
    CsvFileComponent,
    WelcomeComponent,
    DashboardComponent,
    ChartComponent,
    CalendarComponent,
    AdminComponent,
    AdminUpdateComponent,
    AbsenceListComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    UnauthorizedComponent,
    AddSchoolComponent,
    UpdateSchoolComponent,
    AddOwnerComponent,
    AdminDashboardComponent,
    AddDeveloperComponent,
    
  ],
  imports: [
    DevelopersComponent,
    SchoolListComponent,
    ParentListComponent,
    StudentListComponent,
    AdminListComponent,
    MessagesComponent,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
    QRCodeModule,
    NgxEchartsDirective,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FullCalendarModule,
    TableModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    SidebarModule,
    RippleModule,
    StyleClassModule,
    MultiSelectModule,
    SelectButtonModule,
    ThemeToggleComponent,
    ManagersListComponent,
    CalendarModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   },
    //   defaultLanguage: 'en'
    // })
  ],
  exports: [
    PaginationModule
  ],
  providers: [
    // إزالة provideClientHydration لأنه متعلق بـ SSR
    // TranslateService,
    PrimeNGConfig,
    provideFirebaseApp(() => initializeApp({"projectId":"studentsystem-f07f6","appId":"1:582608084285:web:9b8b7b3ed861e29ae07954","storageBucket":"studentsystem-f07f6.appspot.com","apiKey":"AIzaSyBRfoTSPD5GrnM8OA7wwul3tVKUdX1iskk","authDomain":"studentsystem-f07f6.firebaseapp.com","messagingSenderId":"582608084285","measurementId":"G-YB1BMM5Z18"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideRemoteConfig(() => getRemoteConfig()),
    { provide: HTTP_INTERCEPTORS, useClass: customeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true },
    SignalRService,
    // LanguageService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initLanguageServiceFactory,
    //   deps: [LanguageService],
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }