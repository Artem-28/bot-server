import { IsBoolean } from 'class-validator';

export class FakeDataDto {
  @IsBoolean()
  users: boolean;

  @IsBoolean()
  projects: boolean;

  @IsBoolean()
  questionTypes: boolean;

  @IsBoolean()
  permissions: boolean;
}
