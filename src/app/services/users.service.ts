import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, forkJoin, Observable, of, Subject } from 'rxjs';

export interface ExportResult {
  users: any[] | null;
  posts: any[] | null;
  errors: { users?: string; posts?: string };
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();

  private exportLoadingSubject = new Subject<boolean>();
  exportLoading$ = this.exportLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<any[]> {
    this.loadingSubject.next(true);
    return this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(finalize(() => this.loadingSubject.next(false)));
  }

  exportData(): Observable<ExportResult> {
    this.exportLoadingSubject.next(true);

    const users$ = this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(catchError(() => of(null)));

    const posts$ = this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/posts')
      .pipe(catchError(() => of(null)));

    return forkJoin({ usersResult: users$, postsResult: posts$ }).pipe(
      finalize(() => this.exportLoadingSubject.next(false)),
      (source$) =>
        new Observable<ExportResult>((observer) => {
          source$.subscribe({
            next: ({ usersResult, postsResult }) => {
              const errors: ExportResult['errors'] = {};
              if (!usersResult) errors['users'] = 'Failed to fetch users';
              if (!postsResult) errors['posts'] = 'Failed to fetch posts';
              observer.next({ users: usersResult, posts: postsResult, errors });
              observer.complete();
            },
            error: (err) => observer.error(err),
          });
        })
    );
  }
}