import { User } from '@/modules/user/user.entity';
import { Project } from '@/modules/project/project.entity';

export interface IResponseCombineUserSubscriber {
  user: User;
  projects: Project[];
}
