import { Project } from '../../project/project.entity';
import { User } from '../../user/user.entity';

export interface IResponseCombineUserSubscriber {
  user: User;
  projects: Project[];
}
