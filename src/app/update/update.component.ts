import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit{
  student:any;
  id:any;
  constructor(private act: ActivatedRoute,private _shared:SharedService,private router:Router) { 

  }
  ngOnInit(): void {
    
    this.id = this.act.snapshot.paramMap.get('id');
    this._shared.getStudentById(this.id)
    .subscribe(
      res=>{
        this.student = res;
        

      },
      err=>{
        console.log(err);
      }
    )


  }
  updateStudent(){
    this._shared.updateStudent(this.id,this.student)
    .subscribe(
      res=>{
        console.log(res);
        this.router.navigate(['/student-list']);
      },
      err=>{
        console.log(err);
      }
    )

  }

}
