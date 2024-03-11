import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '@app-services/user/service/queries/get-users/get-users.query';
import { UserAggregate } from '@app-services';
import { UserRepository } from '@app-services/user/providers';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
  implements IQueryHandler<GetUsersQuery, UserAggregate[]>
{
  constructor(private readonly _userRepository: UserRepository) {}

  async execute(query: GetUsersQuery): Promise<UserAggregate[]> {
    const result = await this._userRepository.findAll();
    return [];
  }
}
