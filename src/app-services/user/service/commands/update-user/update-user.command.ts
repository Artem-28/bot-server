import { UpdateUserDto } from '../dto';

export class UpdateUserCommand {
  constructor(public readonly dto: UpdateUserDto) {}
}
