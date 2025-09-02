import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  refreshToken?: string;
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
    // DummyJSON can return either {accessToken, refreshToken} or legacy {token}
    return this.http.post<any>(`${this.api}/auth/login`, { ...body, expiresInMins: 60 }).pipe(
      map(res => ({
        id: res.id,
        username: res.username,
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        image: res.image,
        accessToken: res.accessToken ?? res.token,
        refreshToken: res.refreshToken
      } satisfies LoginResponse))
    );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.api}/auth/me`);
  }

  refresh(refreshToken?: string): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.api}/auth/refresh`, { refreshToken, expiresInMins: 60 });
  }

  register(body: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/users/add`, body);
  }
}
