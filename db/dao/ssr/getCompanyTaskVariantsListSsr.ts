import { SORT_ASC } from '../../../config/common';
import { getFieldStringLocale } from '../../../lib/i18n';
import { COL_TASK_VARIANTS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { TaskVariantInterface } from '../../uiInterfaces';

export interface GetCompanyTaskVariantsListSsr {
  companySlug: string;
  locale: string;
}

export async function getCompanyTaskVariantsListSsr({
  companySlug,
  locale,
}: GetCompanyTaskVariantsListSsr): Promise<TaskVariantInterface[] | null> {
  try {
    const { db } = await getDatabase();
    const taskVariantsCollection = db.collection<TaskVariantInterface>(COL_TASK_VARIANTS);
    const taskVariantsAggregation = await taskVariantsCollection
      .aggregate<TaskVariantInterface>([
        {
          $match: {
            companySlug,
          },
        },
        {
          $sort: {
            _id: SORT_ASC,
          },
        },
      ])
      .toArray();
    const taskVariants: TaskVariantInterface[] = taskVariantsAggregation.map((taskVariant) => {
      return {
        ...taskVariant,
        name: getFieldStringLocale(taskVariant.nameI18n, locale),
      };
    });
    return taskVariants;
  } catch (e) {
    console.log('getCompanyTaskVariantsListSsr error', e);
    return null;
  }
}
