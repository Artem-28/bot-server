import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '@app-services/user/service/queries/get-user/get-user.query';
import { UserAggregate } from '@app-services';
import { UserRepository } from '@app-services/user/providers';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, UserAggregate>
{
  constructor(private readonly _userRepository: UserRepository) {}

  async execute({ id }: GetUserQuery): Promise<UserAggregate> {
    return await this._userRepository.findOne(id);
  }
}
