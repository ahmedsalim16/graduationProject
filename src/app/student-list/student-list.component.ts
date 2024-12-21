
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { customeInterceptor } from '../custome.interceptor';
import { Token } from '@angular/compiler';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
pagination: any;
  constructor(public shared:SharedService){}
  student:any;
  searchtext:string='';
  pagesize:number=20;
  totalItems:number;
  itemsPerPage:number=20;
  pageNumber:number=1;
  count:number=0;
  s='search for student';
 public qrValue:string;

  ngOnInit(): void {
    
    this.getStudents();

  }


 
getStudents(){
  localStorage.getItem('token');
  this.shared.getAllStudentspagination(this.pageNumber,this.pagesize).subscribe(
    res=>{
      this.student=res;
      
      
     
      
      
      

    },
    err=>{
      console.log(err);
      
    }
  )
}


  delete(id:number){
    this.shared.deleteStudent(id) .subscribe(
      res=>{
        console.log(res);
       this.ngOnInit()
        //this.student=this.student.filter((a:any)=>a.id!=id);
        },
        err=>{
          console.log(err);
          }
    )

  }
  pagechanged(event:any){
    this.pageNumber=event;
    // this.getStudents();
  }

  downloadCsvFile(){
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'my title',
      useBom: true,
      headers: ["ID","FirstName", "LastName", "Email","address","City","grade","gender","age"]
    };
   
    new ngxCsv(this.student, 'my-first-csv', options);
  }

  // search(searchtext: string=''){
  //   this.shared.search(searchtext).subscribe(
  //     res=>{
  //       this.student=res;

  //     },
  //     err=>{
  //       console.log(err);
  //     }
  //   )
      
  // }

  // onPrevious(){
  //   this.PageNumber --;
  //   this.shared.getAllStudents(this.PageNumber,this.pagesize);
  // }
  // onNext() {
  //   this.PageNumber ++;
  //   this.shared.getAllStudents(this.PageNumber,this.pagesize);
  // }

}
