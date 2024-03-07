import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserAggregate } from '@app-services';
import { UserRepository } from '@app-services/user/providers';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, UserAggregate>
{
  constructor(
    private readonly _userRepository: UserRepository,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<UserAggregate> {
    const userAggregate = UserAggregate.create(dto);
    return await this._userRepository.save(userAggregate);
  }
}
