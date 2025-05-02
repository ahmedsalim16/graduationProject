import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'; 

@Component({
  selector: 'app-admin-update',
  templateUrl: './admin-update.component.html',
  styleUrl: './admin-update.component.css'
})
export class AdminUpdateComponent {
admin:any = {};
  id:any;
 roles = JSON.parse(localStorage.getItem('roles') || '[]');
  constructor(private act: ActivatedRoute,private _shared:SharedService,private router:Router,public authService:AuthService) { 

  }
  ngOnInit(): void {
    
    
    const adminId = this.act.snapshot.paramMap.get('id'); // الحصول على ID من مسار URL
    if (adminId) {
      this.getadminById(adminId); // استدعاء البيانات
    }

  }
  goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
  Cancel():void{
    this.admin = {
      userName: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
    }
  }
  getadminById(id: string): void {
    this._shared.getAdminById(id).subscribe(
      (data) => {
        // ملء كائن الطالب بالبيانات المسترجعة
        this.admin = data.result;
  
        // تحويل الحقول المطلوبة إلى نصوص
        if (this.admin) {
          
  
          if (this.admin.Gender) {
            console.log('Gender is already a string:', this.admin.Gender);
          } else {
            console.warn('Gender field is missing or empty:', this.admin.Gender);
            this.admin.Gender = 'Unknown'; // وضع قيمة افتراضية إذا لم يكن موجودًا
          }
        }
  
        console.log('admin data fetched successfully:', this.admin);
      },
      (error) => {
        console.error('Error fetching admin data:', error);
      }
    );
  }
  
  

  updateadmin() {
    const genderValue = this.admin.gender === 'Male' ? 0 : this.admin.gender === 'Female' ? 1 : null;
  console.log('Original Gender:', this.admin.gender); // عرض النص الأصلي
  console.log('Gender Value:', genderValue);
    const adminData = {
      id: this.admin.id || '',
      userName: this.admin.userName || '',
      email: this.admin.email || '',
      firstName: this.admin.firstName || 'N/A',
      lastName: this.admin.lastName || 'N/A',
      phoneNumber: this.admin.phoneNumber || 'N/A',
      address: this.admin.address || 'N/A',
      gender: genderValue // تحويل النص إلى رقم
    };
  
    console.log('Data being sent:', adminData);
  
    this._shared.updateAdmin(adminData).subscribe(
      (res) => {
        console.log('Response from server:', res);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Admin updated successfully',
          showConfirmButton: false,
          timer: 1500
        });
        if(this.roles.includes('Admin')){
          this.router.navigate(['/developers']);
        }
        else if(this.roles.includes('Manager')){

          this.router.navigate(['/admin-list']);
        }
      },
      (err) => {
        console.error('Error:', err);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: err.error?.message || "Can't update admin",
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
  
 
  
  
  
  
}
