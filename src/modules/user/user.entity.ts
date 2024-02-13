import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { Project } from '@/modules/project/project.entity';
import { ProjectSubscriber } from '@/modules/project-subscriber/projectSubscriber.entity';
import { PermissionUser } from '@/modules/permission/permission-user.entity';
import { getUpdateDto } from '@/modules/user/dto/user.dto';

// Guard

// Types

// Helper

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'license_agreement' })
  licenseAgreement: boolean;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'phone_verified_at', nullable: true })
  phoneVerifiedAt: Date;

  @Column({ name: 'last_active_at', nullable: true })
  lastActiveAt: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(
    () => ProjectSubscriber,
    (projectSubscriber) => projectSubscriber.user,
  )
  public subscribedProjects: ProjectSubscriber[];

  @OneToMany(() => PermissionUser, (permissionUser) => permissionUser.user, {
    cascade: true,
  })
  public permissions: PermissionUser[];

  public subscriptionAt: Date | null = null;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  public update(partial: Partial<User>) {
    const dto = getUpdateDto(partial);
    Object.assign(this, dto);
  }

  public get projectIds(): number[] {
    if (!this.projects) return [];
    return this.projects.map((project) => project.id);
  }

  public get subscribedProjectIds(): number[] {
    if (!this.subscribedProjects) return [];
    return this.subscribedProjects.map((project) => project.projectId);
  }
}
