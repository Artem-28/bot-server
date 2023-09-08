import { BaseEntity } from '../../base/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UsersEntity extends BaseEntity {
  @Column()
  email: string;

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
}
