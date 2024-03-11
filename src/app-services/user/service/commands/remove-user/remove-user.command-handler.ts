import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveUserCommand } from '@app-services/user/service/commands/remove-user/remove-user.command';
import { UserRepository } from '@app-services/user/providers';

@CommandHandler(RemoveUserCommand)
export class RemoveUserCommandHandler
  implements ICommandHandler<RemoveUserCommand, boolean>
{
  constructor(private readonly _userRepository: UserRepository) {}

  async execute({ id }: RemoveUserCommand): Promise<boolean> {
    return await this._userRepository.remove(id);
  }
}
