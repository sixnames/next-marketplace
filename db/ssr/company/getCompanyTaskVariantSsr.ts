import { getDbCollections } from 'db/mongodb';
import { TaskVariantInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';

export interface GetCompanyTaskVariantSsr {
  locale: string;
  taskVariantId: string;
}

export async function getCompanyTaskVariantSsr({
  taskVariantId,
  locale,
}: GetCompanyTaskVariantSsr): Promise<TaskVariantInterface | null> {
  try {
    const collections = await getDbCollections();
    const taskVariantsCollection = collections.taskVariantsCollection();
    const taskVariant = await taskVariantsCollection.findOne({
      _id: new ObjectId(taskVariantId),
    });
    if (!taskVariant) {
      return null;
    }
    return {
      ...taskVariant,
      name: getFieldStringLocale(taskVariant.nameI18n, locale),
    };
  } catch (e) {
    console.log('getCompanyTaskVariantSsr error', e);
    return null;
  }
}
