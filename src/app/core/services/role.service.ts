import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:3000/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  createRole(role: Omit<Role, 'id'>): Observable<any> {
    return this.http.post(this.apiUrl, role);
  }

  updateRole(role: Role): Observable<any> {
    return this.http.put(`${this.apiUrl}/${role.id}`, role);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  checkRoleNameExists(name: string, id?: number): Observable<boolean> {
    return this.getRoles().pipe(
      map((roles) =>
        roles.some(
          (role) =>
            role.name.toLowerCase() === name.toLowerCase() && role.id !== id
        )
      )
    );
  }
}
