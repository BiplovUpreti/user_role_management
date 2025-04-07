import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserStore } from '../../core/store/user.store';
import { User } from '../../core/interfaces/user.interface';
import { UserFormComponent } from './components/user-form/user-form.component';
import { AuthStore } from '../../core/store/auth.store';
import { Permission } from '../../core/enums/permission.enum';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzTagModule,
    NzSpinModule,
    NzDrawerModule,
    NzIconModule,
    UserFormComponent,
  ],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  isDrawerVisible = false;
  isModalVisible = false;
  isDeleteModalVisible = false;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  Permission = Permission;

  constructor(public userStore: UserStore, public authStore: AuthStore) {}

  ngOnInit(): void {
    this.userStore.loadUsers();
  }

  showCreateModal(): void {
    this.selectedUser = null;
    this.isModalVisible = true;
  }

  showEditModal(user: User): void {
    this.selectedUser = user;
    this.isModalVisible = true;
  }

  showDeleteModal(user: User): void {
    this.userToDelete = user;
    this.isDeleteModalVisible = true;
  }

  handleFormSubmit(user: User): void {
    if (this.selectedUser) {
      this.userStore.updateUser(user);
    } else {
      this.userStore.createUser(user);
    }
    this.isModalVisible = false;
  }

  confirmDelete(): void {
    if (this.userToDelete) {
      this.userStore.deleteUser(this.userToDelete.id);
      this.isDeleteModalVisible = false;
      this.userToDelete = null;
    }
  }

  showUserDetail(user: User): void {
    this.selectedUser = user;
    this.isDrawerVisible = true;
  }

  closeDrawer(): void {
    this.isDrawerVisible = false;
    this.selectedUser = null;
  }
}
