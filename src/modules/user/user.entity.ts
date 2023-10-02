import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base/entities/base.entity';
import { Project } from '../project/project.entity';
import { ProjectSubscriber } from '../project-subscriber/projectSubscriber.entity';

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
  public subscribedProjects: Project[];

  // @ManyToMany(() => Project, (project) => project.subscribers)
  // subscribedProjects: Project[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
