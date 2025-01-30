import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable,Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from './services/shared.service';

@Injectable()
export class customeInterceptor implements HttpInterceptor  {
  constructor(private injector:Injector){}
  // intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    
  //   const localToken=localStorage.getItem('token');
  //   req=req.clone({headers:req.headers.set('Authorization','Bearer'+localToken)})
  //   return next.handle(req);
  // }
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    let authService = this.injector.get(SharedService); // استدعاء الخدمة
    let token = authService.getToken(); // استرجاع التوكن
     
    let tokenreq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token || ''}` // تأكد من عدم إرسال undefined
      }
    });
    return next.handle(tokenreq); // متابعة الطلب
  }
  
  
  
};


