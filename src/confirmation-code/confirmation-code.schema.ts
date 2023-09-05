import { EntitySchema } from 'typeorm';
import ConfirmationCode from './confirmation-code';
import { EnumConfirmation } from '../enum/EnumConfirmation';

export const ConfirmationCodeSchema = new EntitySchema<ConfirmationCode>({
  name: 'ConfirmationCode',
  target: ConfirmationCode,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
      generationStrategy: 'increment',
    },
    type: {
      type: String,
      enum: [EnumConfirmation.TYPE_REGISTRATION],
    },
    code: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      nullable: true,
    },
  },
});
