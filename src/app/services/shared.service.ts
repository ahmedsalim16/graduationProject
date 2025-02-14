import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import path from 'path';
import { StudentComponent } from '../student/student.component';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../api';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor( private http:HttpClient) { }
  private studentCountSource = new BehaviorSubject<number>(0); // حالة العدد الافتراضية هي 0
  studentCount$ = this.studentCountSource.asObservable();
  setStudentCount(count: number): void {
    this.studentCountSource.next(count); // تحديث العدد وإعلام الكومبوننتات المشتركة
  }
  
  private Url='http://adhamapis.runasp.net/api/Account/'/* put the back-end server link */
  private Url2='https://salimapi.runasp.net/account/'/* put the back-end server link */
 // private Url='https://jsonplaceholder.typicode.com/users'/* put the back-end server link */
  //studentList:any[]=[]

  createNewStudent(studentData: any){
    return this.http.post("https://school-api.runasp.net/api/Student/Add",studentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  }
  createNewAdmin(admin:any){
    return this.http.post("https://school-api.runasp.net/api/User/Add",admin)

  }
  getAllAdmins(PageNumber:number,pagesize:number):Observable<ApiResponse>{//?pageSize=10&pageNumber=1
    // return this.http.get(this.Url+`getall?pageSize=${pagesize}&pageNumber=${PageNumber}`)
    const params = new HttpParams()
       .set('pageNumber', PageNumber.toString())
       .set('pageSize', pagesize.toString());
       return this.http.get<ApiResponse>("https://school-api.runasp.net/api/User/GetAll");
   }
   filterAdmins(filters: {  role?: string; pageNumber: number; pageSize: number }) {
    let params = new URLSearchParams();
    if (filters.role !== undefined) {
      params.append('role', filters.role.toString());
    }
    params.append('pageNumber', filters.pageNumber.toString());
    params.append('pageSize', filters.pageSize.toString());
  
    return this.http.get(`https://school-api.runasp.net/api/User/GetAll?${params.toString()}`);
  }

  getAdminById(id:any): Observable<any>{
    return this.http.get<any>("https://school-api.runasp.net/api/User/GetById/"+id)
  }

  updateAdmin(adminData: any): Observable<any> {
    return this.http.put('https://school-api.runasp.net/api/User/Update', adminData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  



  deleteadmins(id:string){
   
     
   return this.http.delete("https://school-api.runasp.net/api/User/Delete/"+id)
  }
  deleteStudent(id:string){
   
     
   return this.http.delete("https://school-api.runasp.net/api/Student/Delete/"+id)
  }

  getAllStudentsgrade(grade:number,PageNumber:number,pagesize:number):Observable<ApiResponse>{
    const params = new HttpParams()
      .set('pageNumber', PageNumber.toString())
      .set('pageSize', pagesize.toString());
      return this.http.get<ApiResponse>("https://school-api.runasp.net/api/Student/GetAll"+`?Grade=${grade}`)
  }
  getAllStudentsgender(gender:number,PageNumber:number,pagesize:number):Observable<ApiResponse>{
    const params = new HttpParams()
      .set('pageNumber', PageNumber.toString())
      .set('pageSize', pagesize.toString());
      return this.http.get<ApiResponse>("https://school-api.runasp.net/api/Student/GetAll"+`?Gender=${gender}`)
  }
  filterStudents(filters: { gender?: number; grade?: number; pageNumber: number; pageSize: number }) {
    let params = new URLSearchParams();
  
    if (filters.gender !== undefined) {
      params.append('gender', filters.gender.toString());
    }
    if (filters.grade !== undefined) {
      params.append('grade', filters.grade.toString());
    }
    params.append('pageNumber', filters.pageNumber.toString());
    params.append('pageSize', filters.pageSize.toString());
  
    return this.http.get(`https://school-api.runasp.net/api/Student/GetAll?${params.toString()}`);
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
    return this.http.get<any>("https://school-api.runasp.net/api/Student/GetById/"+id)
  }

  updateStudent(student: any):Observable<any> {
    return this.http.put("https://school-api.runasp.net/api/Student/Update",student)
  }
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  loginPage(loginObj: any,headers:any):Observable<any>{
    return this.http.post("https://school-api.runasp.net/api/Account/login",loginObj)
  }
  private token: string | null = null; 

 
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token); 
    
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token'); 
    }
     
    return this.token;
  }
  
  

  private baseUrl = 'https://school-api.runasp.net/api/Student';
  getStudentCountByGender(gender?: number): Observable<any> {
    let url = `${this.baseUrl}/GetCount`;
    if (gender !== undefined) {
      url += `?gender=${gender}`;
    }
    return this.http.get<any>(url);
  }
  private baseUrl2='https://school-api.runasp.net/api/Attendance';
  getAllAbsents(grade: number, date: string): Observable<ApiResponse> {
    
    const params = new HttpParams()
      .set('Grade', grade.toString())
      .set('date', date);

    
    return this.http.get<ApiResponse>(`${this.baseUrl2}/GetAllAbsents?`, { params });
  }
  sendEmail(emailData: any) {
    return this.http.post('https://school-api.runasp.net/api/Email', emailData,{ responseType: 'text' });
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

