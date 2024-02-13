import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Module

// Controller

// Service

// Entity
import { PermissionUser } from '@/modules/permission/permission-user.entity';

// Guard

// Types
import { PermissionUserEnum} from '@/base/enum/permission/permission.enum';

// Helper

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryColumn({ type: 'enum', enum: PermissionUserEnum, unique: true })
  public code: PermissionUserEnum;

  @Column({
    name: 'parent_code',
    type: 'enum',
    enum: PermissionUserEnum,
    nullable: true,
    default: null,
  })
  public parentCode: PermissionUserEnum | null;

  @Column()
  public label: string;

  @ManyToOne(() => Permission, (permission) => permission.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_code' })
  parent: Permission;

  @OneToMany(() => Permission, (permission) => permission.parent)
  public children: Permission[];

  @OneToMany(
    () => PermissionUser,
    (permissionUser) => permissionUser.permission,
  )
  public permissionUsers: PermissionUser[];
}
