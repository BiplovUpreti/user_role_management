import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:3000/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createRole(role: any): Observable<any> {
    return this.http.post(this.apiUrl, role);
  }

  updateRole(role: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${role.id}`, role);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  checkRoleNameExists(name: string, id?: string): Observable<boolean> {
    return this.getRoles().pipe(
      map(roles => roles.some(role => 
        role.name.toLowerCase() === name.toLowerCase() && role.id !== id
      ))
    );
  }
}