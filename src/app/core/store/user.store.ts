import { inject, Injectable } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { UserService } from '../services/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from '../interfaces/user.interface';
import { RoleService } from '../services/role.service';
import { Role } from '../interfaces/role.interface';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class UserStore extends signalStore(
  withState<UserState>(initialState),
  withMethods(
    (
      store,
      userService = inject(UserService),
      roleService = inject(RoleService),
      message = inject(NzMessageService)
    ) => ({
      loadUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            userService.getUsers().pipe(
              switchMap((users) => {
                return roleService.getRoles().pipe(
                  map((roles: Role[]) => {
                    const usersWithRoles = users.map((user) => ({
                      ...user,
                      role: roles.find((role) => role.id === user.roleId),
                    }));
                    return usersWithRoles;
                  })
                );
              }),
              tapResponse({
                next: (usersWithRoles) => {
                  patchState(store, { users: usersWithRoles, loading: false });
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to load users');
                },
              })
            )
          )
        )
      ),

      createUser: rxMethod<Omit<User, 'id'>>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((user) => {
            const newId =
              store.users().length > 0
                ? Math.max(...store.users().map((u) => u.id)) + 1
                : 1;
            const newUser = { ...user, id: newId?.toString() };
            return userService.createUser(newUser).pipe(
              switchMap((createdUser) =>
                roleService.getRoles().pipe(
                  map((roles) => {
                    const role = roles.find((r) => r.id === createdUser.roleId);
                    return { ...createdUser, role };
                  })
                )
              ),
              tapResponse({
                next: (createdUserWithRole) => {
                  patchState(store, (state) => ({
                    users: [...state.users, createdUserWithRole],
                    loading: false,
                  }));
                  message.success('User created successfully');
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to create user');
                },
              })
            );
          })
        )
      ),

      updateUser: rxMethod<User>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((user) =>
            userService.updateUser(user).pipe(
              switchMap((createdUser) =>
                roleService.getRoles().pipe(
                  map((roles) => {
                    const role = roles.find((r) => r.id === createdUser.roleId);
                    return { ...createdUser, role };
                  })
                )
              ),
              tapResponse({
                next: (updatedUser) => {
                  patchState(store, (state) => ({
                    users: state.users.map((u) =>
                      u.id === updatedUser.id ? updatedUser : u
                    ),
                    loading: false,
                  }));
                  message.success('User updated successfully');
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to update user');
                },
              })
            )
          )
        )
      ),

      deleteUser: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((id) =>
            userService.deleteUser(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => ({
                    users: state.users.filter((u) => u.id !== id),
                    loading: false,
                  }));
                  message.success('User deleted successfully');
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to delete user');
                },
              })
            )
          )
        )
      ),

      assignRoles: rxMethod<{ userId: number; roleId: number }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ userId, roleId }) =>
            userService.assignRole(userId, roleId).pipe(
              tapResponse({
                next: (updatedUser) => {
                  patchState(store, (state) => ({
                    users: state.users.map((u) =>
                      u.id === updatedUser.id ? updatedUser : u
                    ),
                    loading: false,
                  }));
                  message.success('Roles assigned successfully');
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to assign roles');
                },
              })
            )
          )
        )
      ),
    })
  ),
  withHooks({
    onInit(store) {
      store.loadUsers();
    },
  })
) {}
