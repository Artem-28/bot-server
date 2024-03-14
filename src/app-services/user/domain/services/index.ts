import { AggregateRoot } from '@nestjs/cqrs';
import { PLAIN_TO_INSTANCE, PlainToInstance } from './plain-to-instance.case';

export class UserServices extends AggregateRoot implements PlainToInstance {
  plainToInstance = PLAIN_TO_INSTANCE;
}
