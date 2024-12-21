import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable,Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable()
export class customeInterceptor implements HttpInterceptor  {
  constructor(private injector:Injector){}
  // intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    
  //   const localToken=localStorage.getItem('token');
  //   req=req.clone({headers:req.headers.set('Authorization','Bearer'+localToken)})
  //   return next.handle(req);
  // }
  intercept(req: HttpRequest<unknown>,next: HttpHandler){
    let authService=this.injector.get(SharedService);
    let tokenreq=req.clone({
      setHeaders:{
        Authorization:`Bearer ${authService.getToken()}`
      }
    })
    return next.handle(tokenreq)

  }
  
};


