import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './../seguranca/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BensService {
  private apiUrl = 'http://localhost:8080/bens';

  constructor(private http: HttpClient, private authService: AuthService) { }

  listarBens(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
