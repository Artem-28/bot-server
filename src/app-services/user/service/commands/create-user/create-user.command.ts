import { CreateUserDto } from '../dto';
import { QueryOptionsDto } from '@app-services';

export class CreateUserCommand {
  constructor(
    public readonly dto: CreateUserDto,
    public readonly options?: QueryOptionsDto,
  ) {}
}
