import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RoleStore } from '../../core/store/role.store';
import { Role } from '../../core/interfaces/role.interface';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzTagModule,
    NzSpinModule,
    RoleFormComponent,
  ],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class RoleManagementComponent implements OnInit {
  isModalVisible = false;
  isDeleteModalVisible = false;
  selectedRole: Role | null = null;
  roleToDelete: Role | null = null;

  constructor(public roleStore: RoleStore, private message: NzMessageService) {}

  ngOnInit(): void {
    this.roleStore.loadRoles();
  }

  showCreateModal(): void {
    this.selectedRole = null;
    this.isModalVisible = true;
  }

  showEditModal(role: Role): void {
    this.selectedRole = role;
    this.isModalVisible = true;
  }

  handleFormSubmit(role: Role): void {
    if (role.id) {
      this.roleStore.updateRole(role);
    } else {
      this.roleStore.createRole(role);
    }
    this.isModalVisible = false;
  }

  deleteRole(role: any) {
    this.roleToDelete = role;
    this.isDeleteModalVisible = true;
  }

  confirmDelete() {
    if (this.roleToDelete) {
      this.roleStore.deleteRole(this.roleToDelete.id);
      this.isDeleteModalVisible = false;
      this.roleToDelete = null;
    }
  }
}
