import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected fb = inject(FormBuilder); // Changed to protected for template access
  protected authService = inject(AuthService);
  protected router = inject(Router);
  protected message = inject(NzMessageService);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (user) => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(['/users']);
            this.message.success('Login successful!');
          } else {
            this.message.error('Invalid credentials!');
          }
        },
        error: (error) => {
          this.message.error('Login failed!');
        },
      });
    } else {
      console.log('Form is invalid', this.loginForm.errors); // Add debug log
    }
  }
}
