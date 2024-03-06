import { IsDefined, IsNumber, IsString } from 'class-validator';

export class MessageDto {
  @IsDefined()
  @IsNumber()
  sessionId: number;

  @IsDefined()
  @IsString()
  text: string;
}

export class RespondentMessageDto extends MessageDto {
  @IsDefined()
  @IsNumber()
  respondentId: number;
}

export class UserMessageDto extends MessageDto {
  @IsDefined()
  @IsNumber()
  userId: number;
}

export class SendMessageDto {
  toUserId: number | number[];
  message: RespondentMessageDto | UserMessageDto;
  toRespondentId?: number;
}
