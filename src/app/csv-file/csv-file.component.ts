import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ViewChild } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { SharedService } from '../services/shared.service';
@Component({
  selector: 'app-csv-file',
  templateUrl: './csv-file.component.html',
  styleUrl: './csv-file.component.css'
})
export class CsvFileComponent implements OnInit{

  pagination: any;
  constructor(public shared:SharedService,private ngxCsvParser: NgxCsvParser){}
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
    
    

  }


 

  
  delete(id:number){
    // this.csvRecords.forEach((value: number,index: any) => {
    //   if(value==id)
    //     this.csvRecords.splice(index,1);
      
      
    // });
    let index=this.csvRecords.findIndex((e: { id: number; })=>e.id===id)
     if(index!==-1){
       this.csvRecords.splice(index,1)
     }
     console.log(index)
    
      
    
    

  }
  pagechanged(event:any){
    this.pageNumber=event;
    // this.getStudents();
  }

  csvRecords: any;
  header: boolean = true;


  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',', encoding: 'utf8' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;
        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });
  }
}

