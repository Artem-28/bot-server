import { QueryOptionsDto } from '@app-services';

export class GetUserQuery {
  constructor(public readonly options: QueryOptionsDto) {}
}
