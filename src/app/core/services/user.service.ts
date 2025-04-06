import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: Partial<User>): Observable<User> {
    const { username, ...updateData } = user;
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, updateData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((users) =>
        users.some(
          (user) => user.username.toLowerCase() === username.toLowerCase()
        )
      )
    );
  }

  assignRole(userId: number, roleId: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/role`, { roleId });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
