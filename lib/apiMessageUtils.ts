import { DEFAULT_LOCALE, LOCALE_NOT_FOUND_FIELD_MESSAGE } from 'config/common';
import { COL_MESSAGES } from 'db/collectionNames';
import { MessageModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { getI18nLocaleValue } from 'lib/i18n';
import { MessageSlug } from 'types/messageSlugTypes';

interface GetApiMessageInterface {
  slug: MessageSlug;
  locale?: string;
}

export async function getApiMessageValue({
  slug,
  locale,
}: GetApiMessageInterface): Promise<string> {
  const db = await getDatabase();
  const messagesCollection = db.collection<MessageModel>(COL_MESSAGES);
  const messageEntity = await messagesCollection.findOne({ slug });

  if (!messageEntity) {
    return LOCALE_NOT_FOUND_FIELD_MESSAGE;
  }

  return getI18nLocaleValue(messageEntity.messageI18n, locale || DEFAULT_LOCALE);
}

export async function getValidationMessages(): Promise<MessageModel[]> {
  const db = await getDatabase();
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
