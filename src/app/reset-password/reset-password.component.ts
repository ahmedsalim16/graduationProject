import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetData = {
    password: '',
    confirmPassword: '',
    email: '',
    token: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // ✅ الحصول على `token` و `email` من رابط إعادة التعيين
    this.route.queryParams.subscribe(params => {
      this.resetData.token = params['token'];
      this.resetData.email = params['email'];

      if (!this.resetData.token || !this.resetData.email) {
        Swal.fire('Error', 'Invalid reset link!', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

  resetPassword() {
    if (!this.resetData.password || !this.resetData.confirmPassword) {
      Swal.fire('Error', 'Please enter both passwords', 'error');
      return;
    }

    if (this.resetData.password !== this.resetData.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match', 'error');
      return;
    }

    this.sharedService.resetPassword(this.resetData).subscribe({
      next: () => {
        Swal.fire('Success', 'Password reset successfully!', 'success');
        this.router.navigate(['/welcome']);
      },
      error: (err) => {
        console.error('Reset Password Error:', err);
        let errorMessage = err.error?.message || 'Something went wrong!';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
