import { IsDefined } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  title: string;
}
