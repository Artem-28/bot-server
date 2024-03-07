import { Module, OnModuleInit, Provider } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/app-services';
import { USER_COMMAND_HANDLERS } from './service/commands';
import { USER_QUERY_HANDLERS } from './service/queries';
import { USER_EVENT_HANDLERS } from './service/events';
import { UserFacade } from '@app-services/user/service';
import { UserFacadeFactory } from '@app-services/user/providers/user-facade.factory';
import { UserRepository } from '@app-services/user/providers';
import {UserAdapter} from "@app-services/user/providers/user.adapter";

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    ...USER_COMMAND_HANDLERS,
    ...USER_QUERY_HANDLERS,
    ...USER_EVENT_HANDLERS,
    {
      provide: UserFacade,
      inject: [CommandBus, QueryBus, EventBus],
      useFactory: UserFacadeFactory,
    },
    {
      provide: UserRepository,
      useClass: UserAdapter,
    },
    UserRepository as Provider,
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
