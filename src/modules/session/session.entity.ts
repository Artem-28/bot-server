import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { Script } from '@/modules/script/script.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { Message } from '@/modules/message/message.entity';

// Guard

// Types

// Helper

@Entity({ name: 'sessions' })
@Unique(['respondentId', 'scriptId'])
export class Session extends BaseEntity {
  @Column({ name: 'respondent_id' })
  respondentId: number;

  @Column({ name: 'script_id' })
  scriptId: number;

  @ManyToOne(() => Script, (script) => script.sessions, { cascade: true })
  @JoinColumn({ name: 'script_id' })
  public script: Script;

  @ManyToOne(() => Respondent, (respondent) => respondent.sessions, {
    cascade: true,
  })
  @JoinColumn({ name: 'respondent_id' })
  public respondent: Respondent;

  @OneToMany(() => Message, (message) => message.session, {
    cascade: true,
  })
  public messages: Message[];

  constructor(partial: Partial<Session>) {
    super();
    Object.assign(this, partial);
  }
}
