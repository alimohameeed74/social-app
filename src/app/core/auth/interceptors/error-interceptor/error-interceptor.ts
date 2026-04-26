import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      const customError = {
        message: err?.error?.message,
        status: err?.error?.success ? 'success' : 'fail',
        statusCode: err?.status,
      };
      return throwError(() => customError);
    }),
  );
};
