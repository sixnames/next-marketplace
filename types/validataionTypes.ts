import { MessageModel } from 'db/dbModels';

export interface ValidationSchemaArgsInterface {
  locale: string;
  messages: MessageModel[];
}
