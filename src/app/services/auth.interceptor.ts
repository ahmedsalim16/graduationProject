import { HttpInterceptorFn } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
@Injectable()
export class authInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,private shared:SharedService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // احصل على الـ token من خدمة الـ AuthService
    const token = this.shared.getToken(); 

    // تحقق إذا كان هناك Token وقم بإضافته إلى Header
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
