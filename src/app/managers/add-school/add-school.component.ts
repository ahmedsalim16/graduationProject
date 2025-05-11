import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component'; 
@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrl: './add-school.component.css'
})
export class AddSchoolComponent implements OnInit {
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
      sidebarVisible: boolean = false;
  adminId: string | null = null;
school:any;
adminName:string | null = localStorage.getItem('username');
selectedFile: File | null = null;
constructor(public shared:SharedService,public authService:AuthService,private router: Router,private http: HttpClient){}

ngOnInit(): void {
    
  
  this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
  console.log('Admin ID:', this.adminId);

}
navigateToAdminUpdate(): void {
  if (this.adminId) {
    this.router.navigate(['/admin-update', this.adminId]);
  } else {
    console.error('Admin ID not found!');
  }
}
  goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
cancel(): void {
  this.schoolData = {
    Name: '',
    Description: '',
    Address: '',
    Country: '',
    PhoneNumber: '',
    Email: '',
    SchoolLogo: null
  };
}
schoolData = {
  Name: '',
  Description: '',
  Address: '',
  Country: '',
  PhoneNumber: '',
  Email: '',
  SchoolLogo: null
};


// اختيار الملف وتخزينه في `schoolData`
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.schoolData.SchoolLogo = file;
  }
}

// إرسال الطلب إلى API
addSchool() {
  const formData = new FormData();
  formData.append('Name', this.schoolData.Name);
  formData.append('Description', this.schoolData.Description);
  formData.append('Address', this.schoolData.Address);
  formData.append('Country', this.schoolData.Country);
  formData.append('PhoneNumber', this.schoolData.PhoneNumber);
  formData.append('Email', this.schoolData.Email);
  
  // إضافة الصورة إلى `FormData`
  if (this.schoolData.SchoolLogo) {
    formData.append('SchoolLogo', this.schoolData.SchoolLogo);
  }

  // إرسال الطلب إلى API
  this.http.post('https://school-api.runasp.net/api/School/Add', formData).subscribe(
    (response) => {
      console.log('School Added Successfully:', response);
       Swal.fire({
                         position: "center",
                         icon: "success",
                         title: "School added Successfull",
                         showConfirmButton: false,
                         timer: 1500
                       });
              this.schoolData = {
              Name: '',
              Description: '',
              Address: '',
              Country: '',
              PhoneNumber: '',
              Email: '',
              SchoolLogo: null
            };
    },
    (error) => {
      console.error('Error Adding School:', error);
       Swal.fire({
                         position: "center",
                         icon: "error",
                         title: "Error Adding School",
                         showConfirmButton: false,
                         timer: 1500
                       });
    }
  );
}





  isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  logout(): void {
      // عرض نافذة تأكيد باستخدام Swal
      Swal.fire({
        title: 'Logout',
        text: 'are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          // إذا ضغط المستخدم على "نعم"، قم بتسجيل الخروج
          this.authService.logout();
          // يمكنك إضافة رسالة نجاح إذا أردت
          Swal.fire(
            'Logout successfully',
            'success'
          );
        }
        // إذا ضغط على "لا"، فلن يحدث شيء ويتم إغلاق النافذة تلقائياً
      });
    }
  isSchoolOpen = false;
isAdminOpen = false;

toggleDropdown(menu: string) {
  if (menu === 'school') {
    this.isSchoolOpen = !this.isSchoolOpen;
  } else if (menu === 'admin') {
    this.isAdminOpen = !this.isAdminOpen;
  }
}
}
