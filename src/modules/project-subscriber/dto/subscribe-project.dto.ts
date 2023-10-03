import { IsEmail, IsInt } from 'class-validator';

export class SubscribeProjectDto {
  @IsInt()
  projectId: number;

  @IsEmail()
  email: string;
}
