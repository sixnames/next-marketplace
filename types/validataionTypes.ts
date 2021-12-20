import { MessageBase } from '../db/dbModels';

interface ValidationMessageInterface extends MessageBase {
  [key: string]: any;
}

export interface ValidationSchemaArgsInterface {
  locale: string;
  messages: ValidationMessageInterface[];
}
