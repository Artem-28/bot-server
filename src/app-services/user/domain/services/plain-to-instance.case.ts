import { User as IUser } from '@app-services/user/domain';
import { validateSync } from 'class-validator';

export interface PlainToInstance {
  plainToInstance(this: IUser): void;
}

export const PLAIN_TO_INSTANCE = async function (this: IUser) {
  validateSync(this, { whitelist: true });
};
