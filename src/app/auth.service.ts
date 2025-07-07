import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface User {
  id?: number;
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // public redirectUrl?: string;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private readonly API_URL = 'http://localhost:3000';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const initialUser = this.isBrowser ? 
      JSON.parse(localStorage.getItem('currentUser') || 'null') : 
      null;
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signUp(user: User): Observable<User> {  // Changed return type to just User
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<User>(`${this.API_URL}/users`, user, { headers }).pipe(
      tap(response => {
        console.log('User registered:', response);
        if (!response.id) {
          throw new Error('Registration failed - no user ID returned');
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.status === 0) {
          errorMessage = 'Cannot connect to server';
        } else if (error.error) {
          errorMessage = error.error.message || JSON.stringify(error.error);
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  signIn(email: string, password: string): Observable<AuthResponse> {
    return this.http.get<User[]>(
      `${this.API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    ).pipe(
      map(users => {
        if (!users || users.length === 0) {
          throw new Error('Invalid email or password');
        }
        const user = users[0];
        const accessToken = 'fake-jwt-token-for-user-' + user.id;
        this.setAuthState(accessToken, user);
        return { accessToken, user };
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setAuthState(token: string, user: User): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  private clearAuthState(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  // In auth.service.ts
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(
      `${this.API_URL}/users?email=${encodeURIComponent(email)}`
    ).pipe(
      map(users => users.length > 0)
    );
  }
}