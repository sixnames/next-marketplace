import { getDbCollections } from 'db/mongodb';
import { TaskVariantInterface } from 'db/uiInterfaces';
import { SORT_ASC } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';

export interface GetCompanyTaskVariantsListSsr {
  companySlug: string;
  locale: string;
}

export async function getCompanyTaskVariantsListSsr({
  companySlug,
  locale,
}: GetCompanyTaskVariantsListSsr): Promise<TaskVariantInterface[] | null> {
  try {
    const collections = await getDbCollections();
    const taskVariantsCollection = collections.taskVariantsCollection();
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
