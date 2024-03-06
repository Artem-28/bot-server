import { HttpException, Injectable } from '@nestjs/common';
import { StartScriptDto } from '@/modules/client-api/dto/start-script.dto';
import { StartScriptResponse } from '@/modules/client-api/response/start-script.response';
import { RespondentService } from '@/modules/respondent/respondent.service';
import { ScriptService } from '@/modules/script/script.service';
import { Options } from '@/base/interfaces/service.interface';

@Injectable()
export class ClientApiService {
  constructor(
    readonly respondentService: RespondentService,
    readonly scriptService: ScriptService,
  ) {}

  public async startScript(dto: StartScriptDto, options?: Options) {
    const throwException = options && options.throwException;

    const script = await this.scriptService.getOneScript({
      filter: { field: 'id', value: dto.scriptId },
    });
    if (!script && throwException) {
      throw new HttpException('start.script.not_found', 500);
    }
    if (!script) return null;

    const response: StartScriptResponse = {
      script,
      respondent: null,
      session: null,
    };

    if (dto.respondent) {
      response.respondent = await this.respondentService.getOneRespondent({
        filter: { field: 'email', value: dto.respondent.email },
      });
    }

    return response;
  }
}
