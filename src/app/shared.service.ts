import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import path from 'path';
import { StudentComponent } from './student/student.component';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResponse } from './api';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor( private http:HttpClient) { }
  
  private Url='http://adhamapis.runasp.net/api/Account/'/* put the back-end server link */
  private Url2='https://salimapi.runasp.net/account/'/* put the back-end server link */
 // private Url='https://jsonplaceholder.typicode.com/users'/* put the back-end server link */
  //studentList:any[]=[]

  createNewStudent(student:any){
    return this.http.post("https://adhamapis.runasp.net/api/Student/add",student, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  }
  createNewAdmin(admin:any){
    return this.http.post("https://adhamapis.runasp.net/api/User/Add",admin)

  }



  deleteStudent(id:string){
   
     
   return this.http.delete("https://adhamapis.runasp.net/api/Student/Delete?id="+id)
  }

  getAllStudentsgrade(grade:number,PageNumber:number,pagesize:number):Observable<ApiResponse>{
    const params = new HttpParams()
      .set('pageNumber', PageNumber.toString())
      .set('pageSize', pagesize.toString());
      return this.http.get<ApiResponse>("https://adhamapis.runasp.net/api/Student/GetAll"+`?Grade=${grade}`)
  }
  getAllStudentsgender(gender:number,PageNumber:number,pagesize:number):Observable<ApiResponse>{
    const params = new HttpParams()
      .set('pageNumber', PageNumber.toString())
      .set('pageSize', pagesize.toString());
      return this.http.get<ApiResponse>("https://adhamapis.runasp.net/api/Student/GetAll"+`?Gender=${gender}`)
  }

  getAllStudents(){
    return this.http.get(this.Url+'getall')
  }
  getAllStudentspagination(PageNumber:number,pagesize:number):Observable<ApiResponse>{//?pageSize=10&pageNumber=1
   // return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}`)
   const params = new HttpParams()
      .set('pageNumber', PageNumber.toString())
      .set('pageSize', pagesize.toString());
      return this.http.get<ApiResponse>("https://adhamapis.runasp.net/api/Student/GetAll");
  }
//////////////////////    (update)
  getStudentById(id:any): Observable<any>{
    return this.http.get<any>("https://adhamapis.runasp.net/api/Student/GetById/"+id)
  }

  updateStudent(student: FormData):Observable<any> {
    return this.http.put("https://adhamapis.runasp.net/api/Student/update",student)
  }
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  loginPage(loginObj: any,headers:any):Observable<any>{
    return this.http.post("https://adhamapis.runasp.net/api/Account/login",loginObj)
  }

  getToken(){
    return localStorage.getItem('token')
  }
  // search(search:string){
  //   return this.http.get(this.Url+`Search?searchValue=${search}`)
  // }

  // Email:string;
  // Password:string;
  // setLoginStatus(){
  //   if(this.Email=='as0531869@gmail.com'&& this.Password =='123456'){
  //     return 
  //   }
  // }
}

