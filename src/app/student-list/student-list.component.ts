
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { customeInterceptor } from '../custome.interceptor';
import { Token } from '@angular/compiler';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { number } from 'echarts';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
pagination: any;
  constructor(public shared:SharedService){}
  student: any[] = [];
  searchtext:string='';
  pagesize:number=20;
  totalItems:number;
  itemsPerPage:number=4;
  pageNumber:number=1;
  count:number=0;
  grade:number;
  gender:number;
  s='search for student';
 public qrValue:string;

  ngOnInit(): void {
    
    this.getStudents();

  }


 
getStudents(){
  localStorage.getItem('token');
  this.shared.getAllStudentspagination(this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }

    },
    err=>{
      console.log(err);
      
    }
  )
}


filterByGrade1(){
  this.shared.getAllStudentsgrade(this.grade=1,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}
filterByGrade2(){
  this.shared.getAllStudentsgrade(this.grade=2,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}
filterByGrade3(){
  this.shared.getAllStudentsgrade(this.grade=3,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}
filterByGrade4(){
  this.shared.getAllStudentsgrade(this.grade=4,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}
filterByGrade5(){
  this.shared.getAllStudentsgrade(this.grade=5,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}
filterByGrade6(){
  this.shared.getAllStudentsgrade(this.grade=6,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}
filterByGenderM(){
  this.shared.getAllStudentsgender(this.gender=0,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}
filterByGenderF(){
  this.shared.getAllStudentsgender(this.gender=1,this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }
      

    },
    err=>{
      console.log(err);
      
    }
  )
  
}

  delete(id:string){
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

  get filteredStudents() {
    return this.student.filter(student => 
      student.fullName.toLowerCase().includes(this.searchtext.toLowerCase()) ||
      student.city.toLowerCase().includes(this.searchtext.toLowerCase())
    );
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
