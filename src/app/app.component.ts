import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface User {
  userName: string;
  email: string;
  password: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Smart Recipe Generator';
  hideNavbar = false;
  isLoggedIn = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus(); // ✅ Only call it in browser
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const routeData = this.router.routerState.snapshot.root.firstChild?.data;
      this.hideNavbar = routeData?.['hideNavbar'] || false;

      if (isPlatformBrowser(this.platformId)) {
        this.checkAuthStatus(); // ✅ Safe here too
      }
    });
  }

  private checkAuthStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userData = localStorage.getItem('signUpUsers');
        this.isLoggedIn = userData 
          ? (JSON.parse(userData) as User[]).some(user => user.isActive)
          : false;
      } catch (e) {
        console.error('Error reading auth status:', e);
        this.isLoggedIn = false;
      }
    }
    if (this.isLoggedIn) {
        this.loadChatbotScript(); // Load only if logged in
    }
  }

//   private removeChatbotScript(): void {
//   const script = document.getElementById('jotform-chatbot-script');
//   const container = document.getElementById('jotform-chatbot-container');

//   if (script) {
//     script.remove();
//   }

//   if (container) {
//     container.remove();
//   }
// }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userData = localStorage.getItem('signUpUsers');
        if (userData) {
          const users = JSON.parse(userData) as User[];
          const updatedUsers = users.map(user => ({ ...user, isActive: false }));
          localStorage.setItem('signUpUsers', JSON.stringify(updatedUsers));
        }
        //  this.removeChatbotScript(); // 👈 REMOVE chatbot on logout
      } catch (e) {
        console.error('Error during logout:', e);
      }
    }
    
    this.isLoggedIn = false;
    this.router.navigate(['/user-login']);
  }

  // ngAfterViewInit() {
  //   // Load chatbot only if not on the user-login page
  //   if (!this.hideNavbar) {
  //     this.loadChatbotScript();
  //   }
  // }

  private loadChatbotScript(): void {
    if (document.getElementById('jotform-chatbot-script')) return;

    const script = document.createElement('script');
    script.id = 'jotform-chatbot-script';
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/0197c44a66f4772f8e18523610d519d12e6f/embed.js?skipWelcome=1&maximizable=1';
    script.async = true;
    script.onerror = () => console.error('Failed to load chatbot script');

    document.body.appendChild(script);
  }

}