import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oauthTokenUrl = 'http://localhost:8080/login';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  login(email: string, senha: string): Observable<any> {
    const credentials = { email: email, senha: senha };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.oauthTokenUrl, credentials, { headers }).pipe(
      tap((response: any) => {
        if (response && response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.token);
          console.log('Token obtido e armazenado:', response.token);
        }
      })
    );
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
