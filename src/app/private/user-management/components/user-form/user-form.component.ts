import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { User } from '../../../../core/interfaces/user.interface';
import { UserService } from '../../../../core/services/user.service';
import { RoleStore } from '../../../../core/store/role.store';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  passwordVisible = false;
  @Input() user: User | null = null;
  @Output() formSubmit = new EventEmitter<User>();

  userForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: NzMessageService,
    public roleStore: RoleStore
  ) {
    this.userForm = this.fb.group({
      id: [null],
      username: [
        '',
        [Validators.required],
        this.isEditMode() ? [] : [this.checkUsernameExists.bind(this)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required]],
      roleId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.roleStore.loadRoles();
  }

  ngOnChanges() {
    if (this.user) {
      this.userForm.patchValue({
        id: this.user.id,
        username: this.user.username,
        fullName: this.user.fullName,
        roleId: this.user.roleId,
        password: this.user.password,
      });
    }
  }

  isEditMode(): boolean {
    return !!this.user;
  }

  checkUsernameExists(control: any) {
    return this.userService.checkUsernameExists(control.value);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const formValue = this.userForm.value;

      this.userService
        .checkUsernameExists(formValue.username, formValue.id)
        .subscribe({
          next: (exists) => {
            if (exists) {
              this.messageService.error('Username already exists');
              this.isSubmitting = false;
            } else {
              this.formSubmit.emit(formValue);
            }
          },
          error: () => {
            this.isSubmitting = false;
          },
        });
    } else {
      Object.values(this.userForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
