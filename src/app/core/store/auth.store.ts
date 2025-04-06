import { inject, Injectable } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';

type AuthState = {
  user: { username: string; password: string } | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class AuthStore extends signalStore(
  withState<AuthState>(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      router = inject(Router),
      message = inject(NzMessageService),
      userService = inject(UserService)
    ) => {
      return {
        isAuthenticated: () => {
          const user = localStorage.getItem('user');
          return !!user;
        },
        getCurrentUser: (): User => {
          const user = localStorage.getItem('user');
          return user ? JSON.parse(user) : null;
        },
        login: rxMethod<{ username: string; password: string }>(
          pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap(({ username, password }) =>
              authService.login(username, password).pipe(
                map((users) => {
                  const fetchedUser: User | undefined = users.find(
                    (u) => u.username === username && u.password === password
                  ) as User | undefined;

                  if (fetchedUser) {
                    userService.getUserWithRole(fetchedUser).subscribe(userRoleData => {
                      localStorage.setItem('user', JSON.stringify(userRoleData));
                      router.navigate(['/users']);
                      message.success('Login successful!');
                      patchState(store, {
                        user: userRoleData,
                        loading: false,
                      });
                    });
                    return { success: true, token: fetchedUser };
                  } else {
                    message.error('Invalid credentials!');
                    return { success: false, error: 'Invalid credentials' };
                  }
                }),
                tapResponse({
                  next: (response) => {
                    if (response.success) {
                      patchState(store, {
                        user: { username, password },
                        loading: false,
                      });
                    } else {
                      patchState(store, {
                        error: response.error,
                        loading: false,
                      });
                    }
                  },
                  error: (error: Error) =>
                    patchState(store, { error: error.message, loading: false }),
                })
              )
            )
          )
        ),
        logout: () => {
          localStorage.removeItem('user');
          router.navigate(['/login']);
          patchState(store, { user: null });
        },
      };
    }
  ),
  withHooks({
    onInit(store) {
      const user = localStorage.getItem('user');
      if (user) {
        patchState(store, { user: JSON.parse(user) });
      }
    },
  })
) {}
