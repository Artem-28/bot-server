import { User as IUser, UserAggregate } from '../domain';

export abstract class UserRepository {
  abstract save(user: IUser): Promise<UserAggregate>;
  abstract update(user: IUser): Promise<boolean>;
  abstract findOne(id: number): Promise<UserAggregate | null>;
  abstract findAll(): Promise<[UserAggregate[], number]>;
  abstract remove(id: number): Promise<boolean>;
}
