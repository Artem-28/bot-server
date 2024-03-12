import { QueryOptionsDto } from '@app-services';

export class RemoveUserCommand {
  constructor(
    public readonly id: number,
    public readonly options?: QueryOptionsDto,
  ) {}
}
