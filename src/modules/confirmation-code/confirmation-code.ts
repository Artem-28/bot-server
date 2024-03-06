import {Column, Entity, PrimaryColumn} from 'typeorm';
import { BaseEntity } from '@/base/entities/base.entity';
import { ConfirmationTypeEnum } from '@/base/enum/confirmation/confirmation-type.enum';

@Entity({ name: 'confirmation_codes' })
export class ConfirmationCode {
  @PrimaryColumn()
  id: number;
  @Column()
  value: string;

  @Column({ type: 'enum', enum: ConfirmationTypeEnum })
  type: ConfirmationTypeEnum;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  get updatedTimestamp() {
    // const data = this.updatedAt || this.createdAt;
    return new Date().getTime();
  }

  get createdTimestamp() {
    return new Date().getTime();
  }

  constructor(partial: Partial<ConfirmationCode>) {
    // super();
    Object.assign(this, partial);
  }
}
