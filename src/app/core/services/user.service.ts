import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private roleService: RoleService) {}

  getUserWithRole(user: User) {
    return this.roleService.getRoles().pipe(
      map((roles) => {
        const role = roles.find((r) => r.id === user.roleId);
        return { ...user, role };
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkUsernameExists(username: string, id?: number): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.apiUrl}?username=${username}`)
      .pipe(
        map((users) =>
          users.some((user) => user.username === username && user.id !== id)
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
