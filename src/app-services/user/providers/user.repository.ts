import {User as IUser, UserAggregate} from '../domain';

export abstract class UserRepository {
  abstract save(user: IUser): Promise<UserAggregate>;
  abstract findOne(id: number): Promise<UserAggregate | null>;
  abstract findAll(): Promise<[[UserAggregate], number]>;
  abstract delete(id: number): Promise<boolean>;
}
