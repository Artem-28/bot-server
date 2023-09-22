import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base/entities/base.entity';
import { ConfirmationTypeEnum } from '../../base/enum/confirmation/confirmation-type.enum';

@Entity({ name: 'confirmation_codes' })
export class ConfirmationCode extends BaseEntity {
  @Column()
  value: string;

  @Column({ type: 'enum', enum: ConfirmationTypeEnum })
  type: ConfirmationTypeEnum;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  get updatedTimestamp() {
    const data = this.updatedAt || this.createdAt;
    return new Date(data).getTime();
  }

  get createdTimestamp() {
    return new Date(this.createdAt).getTime();
  }

  constructor(partial: Partial<ConfirmationCode>) {
    super();
    Object.assign(this, partial);
  }
}
