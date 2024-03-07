import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from './base-entity';

// Guard

// Types

// Helper

@Entity({ name: 'user-service_users' })
export class UserEntity extends BaseEntity {
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
}
