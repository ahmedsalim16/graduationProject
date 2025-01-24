import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {
pagination: any;
  constructor(public shared:SharedService,public authService:AuthService){}
  admins: any[] = [];
  searchtext:string='';
  pagesize:number=20;
  totalItems:number;
  itemsPerPage:number=4;
  pageNumber:number=1;
  count:number=0;
  role: string | null = null; // لتخزين نوع الجنس المختار
grade: number | null = null;
  s='search for admins';
 public qrValue:string;

  ngOnInit(): void {
    
    this.filteradmins();

  }


 
// getadmins(){
//   localStorage.getItem('token');
//   this.shared.getAllAdmins(this.pageNumber,this.pagesize).subscribe(
//     response=>{
//       console.log(response)
//       if (response && response.result && Array.isArray(response.result)) {
//         this.admins = response.result; // إذا كانت البيانات موجودة، خزّنها
//       } else {
//         console.error('Error: Invalid response format or no data found.');
//         this.admins = []; // تفريغ المصفوفة إذا لم توجد بيانات
//       }

//     },
//     err=>{
//       console.log(err);
      
//     }
//   )
// }


filteradmins() {
  localStorage.getItem('token');
  const filters = {
    role: this.role ?? undefined, // إذا كانت null قم بإرسال undefined   // إذا كانت null قم بإرسال undefined
    pageNumber: this.pageNumber,
    pageSize: this.pagesize,
  };

  this.shared.filterAdmins(filters).subscribe(
    (response: any) => {
      if (response && response.result && Array.isArray(response.result)) {
        this.admins = response.result; // تحديث قائمة الطلاب
        console.log('Filtered admins:', this.admins);
      } else {
        console.error('No data found or invalid response format.');
        this.admins = [];
      }
    },
    (err) => {
      console.error('Error while filtering admins:', err);
    }
  );
}




delete(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this admin!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      this.shared.deleteadmins(id).subscribe(
        (res) => {
          console.log('admin deleted:', res);
          this.admins = this.admins.filter((student: any) => student.id !== id);
          Swal.fire('Deleted!', 'The admin has been deleted.', 'success');
        },
        (err) => {
          console.error('Error while deleting admin:', err);
          Swal.fire('Error!', 'There was an error deleting the admin.', 'error');
        }
      );
    }
  });
}

  pagechanged(event:any){
    this.pageNumber=event;
    // this.getadminss();
  }

  get filteredadmins() {
    return this.admins.filter(admins => 
      admins.userName.toLowerCase().includes(this.searchtext.toLowerCase()) ||
      admins.email.toLowerCase().includes(this.searchtext.toLowerCase()) 
    );
  }

  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
  }
}
