import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const api = inject(ApiService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || isRefreshing) return throwError(() => err);

      const r = auth.getRefreshToken();
      if (!r) { auth.logout(); return throwError(() => err); }

      isRefreshing = true;
      return api.refresh(r).pipe(
        switchMap(res => {
          auth.setToken(res.accessToken);
          if (res.refreshToken) auth.setRefreshToken(res.refreshToken);
          isRefreshing = false;

          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${auth.getToken()}` }
          });
          return next(retried);
        }),
        catchError(e => {
          isRefreshing = false;
          auth.logout();
          return throwError(() => e);
        })
      );
    })
  );
};
