import { SORT_ASC } from 'config/common';
import { COL_PAGES_GROUP, COL_PAGES_GROUP_TEMPLATES } from 'db/collectionNames';
import { PagesGroupModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { PagesGroupInterface, PagesGroupTemplateInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';

// Page groups list
interface GetPageGroupsSsrInterface {
  locale: string;
  companySlug: string;
  isTemplate?: string;
}

export async function getPageGroupsSsr({
  locale,
  companySlug,
  isTemplate,
}: GetPageGroupsSsrInterface): Promise<PagesGroupInterface[] | PagesGroupTemplateInterface[]> {
  const { db } = await getDatabase();
  const pagesGroupsCollection = db.collection<PagesGroupModel>(
    isTemplate ? COL_PAGES_GROUP_TEMPLATES : COL_PAGES_GROUP,
  );

  const pagesGroupsAggregationResult = await pagesGroupsCollection
    .aggregate([
      {
        $match: {
          companySlug,
        },
      },
      {
        $sort: {
          index: SORT_ASC,
        },
      },
    ])
    .toArray();

  const pagesGroups: PagesGroupInterface[] | PagesGroupTemplateInterface[] =
    pagesGroupsAggregationResult.map((pagesGroup) => {
      return {
        ...pagesGroup,
        name: getFieldStringLocale(pagesGroup.nameI18n, locale),
      };
    });

  return pagesGroups;
}
