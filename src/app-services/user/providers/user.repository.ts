import { User as IUser, UserAggregate } from '../domain';
import { QueryOptionsDto } from '@app-services/common/dto';

export abstract class UserRepository {
  abstract save(user: IUser, options?: QueryOptionsDto): Promise<UserAggregate>;
  abstract update(user: IUser, options?: QueryOptionsDto): Promise<boolean>;
  abstract findOne(options?: QueryOptionsDto): Promise<UserAggregate | null>;
  abstract findAll(
    options?: QueryOptionsDto,
  ): Promise<[UserAggregate[], number]>;
  abstract remove(id: number, options?: QueryOptionsDto): Promise<boolean>;
}
