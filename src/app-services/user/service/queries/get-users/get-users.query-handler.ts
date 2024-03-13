import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '@app-services/user/service/queries/get-users/get-users.query';
import { ResponseWithCount, UserAggregate } from '@app-services';
import { UserRepository } from '@app-services/user/providers';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
  implements IQueryHandler<GetUsersQuery, ResponseWithCount<UserAggregate>>
{
  constructor(private readonly _userRepository: UserRepository) {}

  async execute({
    options,
  }: GetUsersQuery): Promise<ResponseWithCount<UserAggregate>> {
    return await this._userRepository.findAll(options);
  }
}
