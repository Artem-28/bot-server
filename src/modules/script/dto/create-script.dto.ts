import { IsDefined } from 'class-validator';

export class CreateScriptDto {
  @IsDefined()
  title: string;
}
