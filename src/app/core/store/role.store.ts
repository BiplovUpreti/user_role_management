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
import { RoleService } from '../services/role.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Role } from '../interfaces/role.interface';

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class RoleStore extends signalStore(
  withState<RoleState>(initialState),
  withMethods(
    (
      store,
      roleService = inject(RoleService),
      message = inject(NzMessageService)
    ) => ({
      loadRoles: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            roleService.getRoles().pipe(
              tapResponse({
                next: (roles) => {
                  patchState(store, { roles, loading: false });
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to load roles');
                },
              })
            )
          )
        )
      ),

      createRole: rxMethod<Omit<Role, 'id'>>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((role) => {
            const newId =
              store.roles().length > 0
                ? Math.max(...store.roles().map((r) => r.id)) + 1
                : 1;
            const newRole: Role = { ...role, id: newId, userType: 'NORMAL' };

            return roleService.createRole(newRole).pipe(
              tapResponse({
                next: (createdRole) => {
                  patchState(store, (state) => ({
                    roles: [...state.roles, createdRole],
                    loading: false,
                  }));
                  message.success('Role created successfully');
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to create role');
                },
              })
            );
          })
        )
      ),

      updateRole: rxMethod<Role>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((role) =>
            roleService.updateRole(role).pipe(
              tapResponse({
                next: (updatedRole) => {
                  patchState(store, (state) => ({
                    roles: state.roles.map((r) =>
                      r.id === updatedRole.id ? updatedRole : r
                    ),
                    loading: false,
                  }));
                  message.success('Role updated successfully');
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to update role');
                },
              })
            )
          )
        )
      ),

      deleteRole: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((id) =>
            roleService.deleteRole(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => ({
                    roles: state.roles.filter((r) => r.id !== id),
                    loading: false,
                  }));
                  message.success('Role deleted successfully');
                },
                error: (error: Error) => {
                  patchState(store, { error: error.message, loading: false });
                  message.error('Failed to delete role');
                },
              })
            )
          )
        )
      ),

      checkRoleNameExists: rxMethod<{ name: string; id?: number }>(
        pipe(
          switchMap(({ name, id }) =>
            roleService.checkRoleNameExists(name, id).pipe(
              tapResponse({
                next: (exists) => {
                  if (exists) {
                    message.error('Role name already exists');
                  }
                },
                error: (error: Error) =>
                  patchState(store, { error: error.message }),
              })
            )
          )
        )
      ),
    })
  ),
  withHooks({
    onInit(store) {
      store.loadRoles();
    },
  })
) {}
