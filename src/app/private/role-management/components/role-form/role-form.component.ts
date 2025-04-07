import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/interfaces/role.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Permission } from '../../../../core/enums/permission.enum';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
  ],
  templateUrl: './role-form.component.html',
})
export class RoleFormComponent {
  allPermissionOptions = [
    { label: 'Create', value: Permission.CREATE },
    { label: 'Read', value: Permission.READ },
    { label: 'Update', value: Permission.UPDATE },
    { label: 'Delete', value: Permission.DELETE },
  ];

  @Input() role: Role | null = null;
  @Output() formSubmit = new EventEmitter<Role>();

  roleForm: FormGroup;
  isSubmitting = false;
  focusedPermissionIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private messageService: NzMessageService
  ) {
    this.roleForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      permissions: this.fb.array([], [Validators.required]),
    });

    if (this.permissions.length === 0) {
      this.addPermission();
    }
  }

  ngOnChanges() {
    if (this.role) {
      this.roleForm.patchValue({
        id: this.role.id,
        name: this.role.name,
      });
      this.permissions.clear();
      this.role.permissions.forEach((permission: string) => {
        this.addPermission(permission);
      });
    }
  }

  get permissions() {
    return this.roleForm.get('permissions') as FormArray;
  }

  addPermission(value: string = '') {
    this.permissions.push(
      this.fb.group({
        permission: [value, Validators.required],
      })
    );
  }

  removePermission(index: number) {
    if (this.permissions.length > 1) {
      this.permissions.removeAt(index);
    }
  }

  onPermissionFocus(index: number) {
    this.focusedPermissionIndex = index;
  }

  filteredPermissionOptions(index: number) {
    const selectedPermissions = this.permissions.controls
      .map((control) => control.get('permission')?.value)
      .filter((val, i) => i !== index && val);

    return this.allPermissionOptions.filter(
      (option) => !selectedPermissions.includes(option.value)
    );
  }

  availablePermissions() {
    const selectedPermissions = this.permissions.controls
      .map((control) => control.get('permission')?.value)
      .filter((val) => val);

    return this.allPermissionOptions.filter(
      (option) => !selectedPermissions.includes(option.value)
    );
  }

  minLengthArray(min: number) {
    return (control: FormControl) => {
      const array = control.value;
      return array.length >= min ? null : { minLength: true };
    };
  }

  onSubmit() {
    this.markFormGroupTouched(this.roleForm);

    if (this.roleForm.valid) {
      this.isSubmitting = true;
      const formValue = {
        ...this.roleForm.value,
        permissions: this.roleForm.value.permissions.map(
          (p: any) => p.permission
        ),
      };

      this.roleService
        .checkRoleNameExists(formValue.name, formValue.id)
        .subscribe({
          next: (exists) => {
            if (exists) {
              this.messageService.error('Role name already exists');
              this.isSubmitting = false;
            } else {
              this.formSubmit.emit(formValue);
            }
          },
          error: () => {
            this.isSubmitting = false;
          },
        });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
