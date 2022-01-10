import { DEFAULT_LOCALE } from '../../../config/common';
import { COL_MESSAGES } from '../../collectionNames';
import { MessageModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { MessageSlug } from '../../../types/messageSlugTypes';
import { getI18nLocaleValue } from '../../../lib/i18n';

interface GetApiMessageInterface {
  slug: MessageSlug;
  locale?: string;
}

export async function getApiMessageValue({
  slug,
  locale,
}: GetApiMessageInterface): Promise<string> {
  const { db } = await getDatabase();
  const messagesCollection = db.collection<MessageModel>(COL_MESSAGES);
  const messageEntity = await messagesCollection.findOne({ slug });

  if (!messageEntity) {
    return 'Message translation not found';
  }

  return getI18nLocaleValue(messageEntity.messageI18n, locale || DEFAULT_LOCALE);
}

export async function getValidationMessages(): Promise<MessageModel[]> {
  const { db } = await getDatabase();
  const messagesCollection = db.collection<MessageModel>(COL_MESSAGES);
  const messages = await messagesCollection
    .find({
      slug: {
        $regex: /validation/,
      },
    })
    .toArray();
  return messages;
}
