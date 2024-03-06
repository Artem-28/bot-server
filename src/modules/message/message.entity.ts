import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from 'typeorm';
// Module

// Controller

// Service

// Entity
import { BaseEntity } from '@/base/entities/base.entity';
import { User } from '@/modules/user/user.entity';
import { Respondent } from '@/modules/respondent/respondent.entity';
import { Session } from '@/modules/session/session.entity';
import {Project} from "@/modules/project/project.entity";

// Guard

// Types

// Helper

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'respondent_id', nullable: true })
  respondentId: number;

  @Column({ name: 'session_id' })
  sessionId: number;

  @Column()
  text: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @ManyToOne(() => Respondent)
  @JoinColumn({ name: 'respondent_id' })
  public respondent: Respondent;

  @ManyToOne(() => Session, (session) => session.messages)
  @JoinColumn({ name: 'session_id' })
  public session: Session;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'unread_user_messages',
    joinColumn: {
      name: 'message_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  unreadUsers: User[];

  @ManyToMany(() => Respondent, { nullable: true })
  @JoinTable({
    name: 'unread_respondent_messages',
    joinColumn: {
      name: 'message_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'respondent_id',
      referencedColumnName: 'id',
    },
  })
  unreadRespondents: Respondent[];

  constructor(partial: Partial<Message>) {
    super();
    Object.assign(this, partial);
  }
}
