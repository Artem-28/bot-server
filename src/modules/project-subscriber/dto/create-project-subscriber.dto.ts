import { IsEmail, IsInt } from 'class-validator';

export class CreateProjectSubscriberDto {
  @IsInt()
  projectId: number;

  @IsEmail()
  email: string;
}
