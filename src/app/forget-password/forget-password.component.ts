import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  email: string = '';

  constructor(private shared: SharedService) {}

  sendResetLink() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter your email', 'error');
      return;
    }
  
    this.shared.forgotPassword(this.email).subscribe({
      next: () => {
        Swal.fire('Success', 'Reset link sent to your email!', 'success');
      },
      error: (err) => {
        console.error('API Error:', err);
        let errorMessage = 'Something went wrong. Please try again later.';
        
        // ✅ التحقق مما إذا كان `err.error` موجودًا وله خاصية `message`
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
  
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
  
}
