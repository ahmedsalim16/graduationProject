import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-grade3',
  templateUrl: './grade3.component.html',
  styleUrl: './grade3.component.css'
})
export class Grade3Component implements OnInit {
  constructor(public shared:SharedService){}
  student:any;
  grade:number=3;
  searchtext:string='';
  pagesize:number=20;
  totalItems:number;
  itemsPerPage:number=10;
  pageNumber:number=1;
  count:number=0;
  s='search for student';


  ngOnInit(): void {
    
      this.getStudents();
    
   
  }

  getStudents(){
    this.shared.getAllStudentsg3(this.grade,this.pageNumber,this.pagesize).subscribe(
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

}
