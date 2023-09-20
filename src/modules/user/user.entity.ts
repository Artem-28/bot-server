import { BaseEntity } from '../../base/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @Column({ name: 'license_agreement' })
  licenseAgreement: boolean;

  @Column({ name: 'email_verified_at' })
  emailVerifiedAt: Date;

  @Column({ name: 'phone_verified_at' })
  phoneVerifiedAt: Date;

  @Column({ name: 'last_active_at' })
  lastActiveAt: Date;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
