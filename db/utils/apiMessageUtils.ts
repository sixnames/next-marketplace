import { MessageModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DEFAULT_LOCALE } from 'lib/config/common';
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
  const collections = await getDbCollections();
  const messagesCollection = collections.messagesCollection();
  const messageEntity = await messagesCollection.findOne({ slug });

  if (!messageEntity) {
    return 'Message translation not found';
  }

  return getI18nLocaleValue(messageEntity.messageI18n, locale || DEFAULT_LOCALE);
}

export async function getValidationMessages(): Promise<MessageModel[]> {
  const collections = await getDbCollections();
  const messagesCollection = collections.messagesCollection();
  const messages = await messagesCollection
    .find({
      slug: {
        $regex: /validation/,
      },
    })
    .toArray();
  return messages;
}
