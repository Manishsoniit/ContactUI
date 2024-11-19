import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Contact model interface
export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private baseUrl = 'http://localhost:5005/api/contacts';

  constructor(private http: HttpClient) {}

  // GET: Fetch all contacts
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // POST: Add a new contact
  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact).pipe(
      catchError(this.handleError)
    );
  }

  // PUT: Update an existing contact
  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${contact.id}`, contact).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE: Delete a contact by ID
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling logic
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server returned code: ${error.status}, message: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
