import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  signUpUsers: any[] = [];
  signUpObj: any = {
    userName: '',
    email: '',
    password: ''
  };
  loginObj: any = {
    email: '',
    password: '',
  };

   constructor(public router: Router) {}
  ngOnInit(): void {
    const localData = localStorage.getItem('signUpUsers');
    if (localData != null) {
      this.signUpUsers = JSON.parse(localData);
    }
  }

  onSignUp() {
    if (!this.signUpObj.userName || !this.signUpObj.email || !this.signUpObj.password) {
      alert('Please fill all fields');
      return;
    }

    const isEmailExists = this.signUpUsers.find(m => m.email === this.signUpObj.email);
    if (isEmailExists) {
      alert('Email already registered');
      return;
    }

    this.signUpUsers.push(this.signUpObj);
    localStorage.setItem('signUpUsers', JSON.stringify(this.signUpUsers));
    
    this.signUpObj = {
      userName: '',
      email: '',
      password: ''
    };
    
    alert('Registration Successful! Please sign in.');
    this.switchToLogin();
  }
  onLoginIn() {
    const userIndex = this.signUpUsers.findIndex(m => 
      m.email == this.loginObj.email && 
      m.password == this.loginObj.password
    );

    if (userIndex !== -1) {
      // Set all users to inactive first
      this.signUpUsers = this.signUpUsers.map(user => ({ ...user, isActive: false }));
      // Set the logged-in user as active
      this.signUpUsers[userIndex].isActive = true;

      // Update localStorage
      localStorage.setItem('signUpUsers', JSON.stringify(this.signUpUsers));

      alert('User Login Successful');
      this.router.navigate(['/']); // ✅ Now the guard should let you through
    } else {
      alert('Wrong Credentials');
    }
  }

  toggleForms() {
    const container = document.getElementById('container');
    container?.classList.toggle("right-panel-active");
  }

  switchToLogin() {
    document.getElementById('container')?.classList.remove("right-panel-active");
  }
}