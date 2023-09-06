import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import {
  EnumConfirmation,
  TEnumConfirmationType,
} from '../enum/EnumConfirmation';

@Entity()
export class ConfirmationCode extends BaseEntity {
  @Column()
  value: string;

  @Column({ type: 'enum', enum: EnumConfirmation })
  type: TEnumConfirmationType;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  get updatedTimestamp() {
    return new Date(this.updatedAt).getTime();
  }

  get createdTimestamp() {
    return new Date(this.createdAt).getTime();
  }
}
