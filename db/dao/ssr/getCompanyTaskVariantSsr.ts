import { ObjectId } from 'mongodb';
import { getFieldStringLocale } from 'lib/i18n';
import { COL_TASK_VARIANTS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { TaskVariantInterface } from '../../uiInterfaces';

export interface GetCompanyTaskVariantSsr {
  locale: string;
  taskVariantId: string;
}

export async function getCompanyTaskVariantSsr({
  taskVariantId,
  locale,
}: GetCompanyTaskVariantSsr): Promise<TaskVariantInterface | null> {
  try {
    const { db } = await getDatabase();
    const taskVariantsCollection = db.collection<TaskVariantInterface>(COL_TASK_VARIANTS);
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
