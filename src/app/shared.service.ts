import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import path from 'path';
import { StudentComponent } from './student/student.component';
import { RouterLink } from '@angular/router';
import { Login } from './login/login.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor( private http:HttpClient) { }
  
  private Url='https://salimapi.runasp.net/api/students/'/* put the back-end server link */
  private Url2='https://salimapi.runasp.net/account/'/* put the back-end server link */
 // private Url='https://jsonplaceholder.typicode.com/users'/* put the back-end server link */
  //studentList:any[]=[]

  createNewStudent(student:any){
    return this.http.post(this.Url,student)

  }
  createNewAdmin(admin:any){
    return this.http.post(this.Url,admin)

  }



  deleteStudent(id: number){
   
     
   return this.http.delete(this.Url +id)
  }

  getAllStudentsg1(grade:number,PageNumber:number,pagesize:number){
    return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}&grade=${grade}`)
  }
  getAllStudentsg2(grade:number,PageNumber:number,pagesize:number){
    return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}&grade=${grade}`)
  }
  getAllStudentsg3(grade:number,PageNumber:number,pagesize:number){
    return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}&grade=${grade}`)
  }
  getAllStudentsg4(grade:number,PageNumber:number,pagesize:number){
    return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}&grade=${grade}`)
  }
  getAllStudentsg5(grade:number,PageNumber:number,pagesize:number){
    return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}&grade=${grade}`)
  }
  getAllStudentsg6(grade:number,PageNumber:number,pagesize:number){
    return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}&grade=${grade}`)
  }
  getAllStudents(){
    return this.http.get(this.Url+'getall')
  }
  getAllStudentspagination(PageNumber:number,pagesize:number){//?pageSize=10&pageNumber=1
   // return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}`)
   const params = new HttpParams()
      .set('pageNumber', PageNumber.toString())
      .set('pageSize', pagesize.toString());
      return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}`);
  }
//////////////////////    (update)
  getStudentById(id:any){
    return this.http.get(this.Url+'getByid' +id)
  }

  updateStudent(id:any,student:any){
    return this.http.put(this.Url+'update',id+student)
  }

  loginPage(loginObj: any):Observable<any>{
    return this.http.post(`${this.Url2}login`,loginObj)
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

