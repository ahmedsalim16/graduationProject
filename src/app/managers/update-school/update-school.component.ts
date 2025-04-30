import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-update-school',
  templateUrl: './update-school.component.html',
  styleUrl: './update-school.component.css'
})
export class UpdateSchoolComponent implements OnInit {
school:any = {};
selectedFile: File | null = null;
  constructor(private act: ActivatedRoute,private _shared:SharedService,private router:Router,public authService:AuthService) { 

  }
  ngOnInit(): void {
    
    
    const schoolId = this.act.snapshot.paramMap.get('id');
    console.log('School ID from URL:', schoolId);
    if (schoolId) {
      this.getschoolById(schoolId); // استدعاء البيانات
    }

  }
  goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
  getLogoUrl(logoPath: string): string {
  return `https://school-api.runasp.net/${logoPath}`;
}
  schoolData: any = {
    SchoolTenantId: '',
    Description: '',
    Address: '',
    Country: '',
    PhoneNumber: '',
    Email: '',
    SchoolLogo: null
  };
  getschoolById(id: string): void {
    this._shared.getSchoolById(id).subscribe(
      (data: any) => {
        // نفترض أن الـ API يرجع البيانات في الخاصية result
        this.school = data.result;
        console.log('School data fetched successfully:', this.school);

        this.schoolData = {
          SchoolTenantId: this.school.schoolTenantId || '',              // إذا كانت البيانات بصيغة lower case
          Description: this.school.description || '',
          Address: this.school.address || '',
          Country: this.school.country || '',
          PhoneNumber: this.school.phoneNumber || '',
          Email: this.school.email || '',
          SchoolLogo: this.school.schoolLogo || null  // يمكن أن يكون رابط أو ملف
        };

        // إذا كان هناك حقل Gender مثلاً، يمكنك إضافته إذا كان مطلوبًا في التحديث
        // this.schoolData.Gender = this.school.Gender || 'Unknown';
      },
      (error) => {
        console.error('Error fetching school data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not load school data'
        });
      }
    );
  }
  
  

  updateschool() {
    const formData = new FormData();
    formData.append('SchoolTenantId', this.schoolData.SchoolTenantId);
    formData.append('Description', this.schoolData.Description);
    formData.append('Address', this.schoolData.Address);
    formData.append('Country', this.schoolData.Country);
    formData.append('PhoneNumber', this.schoolData.PhoneNumber);
    formData.append('Email', this.schoolData.Email);

    // إضافة SchoolLogo إذا كان موجوداً ومحدداً كملف
    if (this.schoolData.SchoolLogo instanceof File) {
      formData.append('SchoolLogo', this.schoolData.SchoolLogo);
    } else if (this.schoolData.SchoolLogo) {
      // إذا كانت SchoolLogo موجودة كرابط، يمكنك إرساله كنص
      formData.append('SchoolLogo', this.schoolData.SchoolLogo);
    }
  
    console.log('Data being sent:', this.schoolData);
  
    this._shared.updateSchool(formData).subscribe(
      (res) => {
        console.log('Response from server:', res);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'school updated successfully',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/school-list']);
      },
      (err) => {
        console.error('Error:', err);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: err.error?.message || "Can't update school",
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.schoolData.SchoolLogo = file;
    }
  }
}
