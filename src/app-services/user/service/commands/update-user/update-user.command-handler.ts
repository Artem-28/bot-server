import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserAggregate } from '@app-services';
import { UserRepository } from '@app-services/user/providers';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand, UserAggregate>
{
  constructor(private readonly _userRepository: UserRepository) {}

  async execute({ dto }: UpdateUserCommand): Promise<UserAggregate | null> {
    const existUser = await this._userRepository.findOne(dto.id);
    if (!existUser) return null;
    Object.assign(existUser, dto);
    const updatedUser = UserAggregate.create(existUser);
    const success = await this._userRepository.update(updatedUser);
    if (!success) return null;
    return updatedUser;
  }
}
