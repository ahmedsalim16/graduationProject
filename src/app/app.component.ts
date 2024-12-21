import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'studentsystem';
  
  constructor(){//private translate:TranslateService
    
  }

  // SwitchLanguage(lang:'ar'|'en'){
  //   this.translate.use(lang);

  // }
}

