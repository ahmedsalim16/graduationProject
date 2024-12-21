import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

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
import { Grade1Component } from './grade1/grade1.component';
import { Grade2Component } from './grade2/grade2.component';
import { Grade3Component } from './grade3/grade3.component';
import { Grade4Component } from './grade4/grade4.component';
import { Grade5Component } from './grade5/grade5.component';
import { Grade6Component } from './grade6/grade6.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, httpsCallableFromURL, provideFunctions } from '@angular/fire/functions';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { customeInterceptor } from './custome.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { NgxQRCodeModule, QrcodeComponent } from '@techiediaries/ngx-qrcode';
import { CsvFileComponent } from './csv-file/csv-file.component';
import { NgxCsvParserModule } from 'ngx-csv-parser';
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
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
 //import { Ng2SearchPipeModule } from 'ng2-search-filter';
//  export function createTranslateLoader(http:HttpClient){
//   return new TranslateHttpLoader(http,'assets/i18n/','.json');
//  }

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    StudentListComponent,
    NotfoundComponent,
    HeaderComponent,
    UpdateComponent,
    FilterPipe,
    LoginComponent,
    Grade1Component,
    Grade2Component,
    Grade3Component,
    Grade4Component,
    Grade5Component,
    Grade6Component,
    CsvFileComponent,
    WelcomeComponent,
    DashboardComponent,
    ChartComponent,
    CalendarComponent,
    AdminComponent,
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
    QRCodeModule,
    NgxCsvParserModule,
    NgxEchartsDirective,
    
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    
    
    }),
   
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FullCalendarModule,
    
    // TranslateModule.forRoot({
    //   defaultLanguage: 'en',
    //   useDefaultLang:true,
    //   loader:{
    //     provide: TranslateLoader,
    //     useFactory:createTranslateLoader,
    //     deps: [HttpClient]
    //   }
    // }),
    
    //Ng2SearchPipeModule
  ],
  exports:[
    PaginationModule
  ],
  providers: [
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp({"projectId":"studentsystem-f07f6","appId":"1:582608084285:web:9b8b7b3ed861e29ae07954","storageBucket":"studentsystem-f07f6.appspot.com","apiKey":"AIzaSyBRfoTSPD5GrnM8OA7wwul3tVKUdX1iskk","authDomain":"studentsystem-f07f6.firebaseapp.com","messagingSenderId":"582608084285","measurementId":"G-YB1BMM5Z18"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideRemoteConfig(() => getRemoteConfig()),
   { provide:HTTP_INTERCEPTORS,useClass:customeInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
