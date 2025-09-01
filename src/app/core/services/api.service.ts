import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginBody { username: string; password: string; }
export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  accessToken: string;
  refreshToken: string;
}
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
export interface MeResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private api = environment.api;

  login(body: LoginBody): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`,
      { ...body, expiresInMins: 60 },
      { withCredentials: true }
    );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.api}/auth/me`, { withCredentials: true });
  }

  refresh(refreshToken?: string): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.api}/auth/refresh`,
      { refreshToken, expiresInMins: 60 },
      { withCredentials: true }
    );
  }

  register(body: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/users/add`, body);
  }
}
