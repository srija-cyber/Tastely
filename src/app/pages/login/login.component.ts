import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports:[FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;
  isSignUpMode = false;
  loading = false;
  returnUrl: string;
  loginError = '';
  signupError = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    // Initialize login form
    this.loginForm = this.formBuilder.group({
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['password123', Validators.required]
    });

    // Initialize signup form
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  toggleForms() {
    this.isSignUpMode = !this.isSignUpMode;
    this.loginError = '';
    this.signupError = '';
  }

  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.signupError = '';

    const newUser = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    console.log('Attempting to register:', newUser); // Debug log

    this.authService.signUp(newUser).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/']); // Redirect to home
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.signupError = error.message;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.loginError = '';
    
    this.authService.signIn(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loginError = error.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}