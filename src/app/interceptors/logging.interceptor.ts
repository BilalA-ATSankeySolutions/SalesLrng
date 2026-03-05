import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    console.log(`HTTP Request started: ${req.method} ${req.urlWithParams}`, req);

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            console.log(`HTTP Response received: ${req.method} ${req.urlWithParams}`, {
              status: event.status,
              body: event.body,
              elapsedTimeMs: elapsed
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          const elapsed = Date.now() - started;
          console.error(`HTTP Request failed: ${req.method} ${req.urlWithParams}`, {
            status: error.status,
            message: error.message,
            elapsedTimeMs: elapsed
          });
        }
      })
    );
  }
}