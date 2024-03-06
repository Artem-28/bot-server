import { Respondent } from '@/modules/respondent/respondent.entity';
import { Script } from '@/modules/script/script.entity';
import { Session } from '@/modules/session/session.entity';

export interface StartScriptResponse {
  script: Script;
  respondent: Respondent | null;
  session: Session | null;
}
