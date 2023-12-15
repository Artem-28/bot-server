import { IsDefined } from 'class-validator';

export class UpdateScriptDto {
  @IsDefined()
  projectId: number;

  title?: string;
}
