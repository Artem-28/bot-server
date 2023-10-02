import { IsDefined } from 'class-validator';

export class CreateScriptDto {
  projectId: number;

  @IsDefined()
  title: string;
}
