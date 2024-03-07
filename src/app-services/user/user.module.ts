import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/app-services';
import { USER_COMMAND_HANDLERS } from './service/commands';
import { USER_QUERY_HANDLERS } from './service/queries';
import { USER_EVENT_HANDLERS } from './service/events';
import { UserFacade } from './service';
import { UserFacadeFactory } from './providers/user-facade.factory';
import { UserRepository } from './providers';
import { UserAdapter } from './providers/user.adapter';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    ...USER_COMMAND_HANDLERS,
    ...USER_QUERY_HANDLERS,
    ...USER_EVENT_HANDLERS,
    UserAdapter,
    {
      provide: UserFacade,
      inject: [CommandBus, QueryBus, EventBus],
      useFactory: UserFacadeFactory,
    },
    {
      provide: UserRepository,
      useClass: UserAdapter,
    },
  ],
  exports: [UserFacade],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
    private readonly _eventBus: EventBus,
  ) {}
  onModuleInit(): any {
    this._commandBus.register(USER_COMMAND_HANDLERS);
    this._queryBus.register(USER_QUERY_HANDLERS);
    this._eventBus.register(USER_EVENT_HANDLERS);
  }
}
