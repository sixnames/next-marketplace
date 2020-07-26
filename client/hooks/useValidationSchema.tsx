import { MessageInterface } from '../config/apiMessages/messagesKeys';
import { Schema } from 'yup';

interface UseValidationSchemaInterface {
  schema: any;
  messagesKeys: MessageInterface[];
}

function useValidationSchema({ schema, messagesKeys }: UseValidationSchemaInterface): Schema<any> {}

export default useValidationSchema;
