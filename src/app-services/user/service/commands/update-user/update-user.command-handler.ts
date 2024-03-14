import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserAggregate } from '@app-services';
import { UserRepository } from '@app-services/user/providers';
import { Logger } from '@nestjs/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand, UserAggregate>
{
  private readonly _logger = new Logger(UpdateUserCommandHandler.name);

  constructor(private readonly _userRepository: UserRepository) {}

  async execute({
    dto,
    options,
  }: UpdateUserCommand): Promise<UserAggregate | null> {
    const throwExceptions = options && options.throwExceptions;
    const existUser = await this._userRepository.findOne({
      filter: { field: 'id', value: dto.id },
      throwExceptions,
    });
    if (!existUser) return null;
    Object.assign(existUser, dto);
    const updatedUser = UserAggregate.create(existUser);
    await updatedUser.plainToInstance();
    const success = await this._userRepository.update(updatedUser);
    if (!success) return null;
    return updatedUser;
  }
}
