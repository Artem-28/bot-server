import { UpdateUserDto } from '../dto';
import { QueryOptionsDto } from '@app-services';

export class UpdateUserCommand {
  constructor(
    public readonly dto: UpdateUserDto,
    public readonly options?: QueryOptionsDto,
  ) {}
}
