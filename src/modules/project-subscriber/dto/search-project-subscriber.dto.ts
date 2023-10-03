import { IsInt } from 'class-validator';

export class SearchProjectSubscriberDto {
  @IsInt()
  projectId: number;

  @IsInt()
  userId: number;
}
